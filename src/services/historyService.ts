import { MistralResponse } from './pdfService';
import { uploadAnalysisReport, getAnalysisReport, listAnalysisReports } from './storageService';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  insights: MistralResponse;
  riskLevel: string;
  clausesIdentified: number;
  status: 'Completed' | 'Failed' | 'In Progress';
  reportUrl?: string;
  pdfUrl?: string;
}

export const saveToHistory = async (insights: MistralResponse, pdfUrl: string): Promise<void> => {
  try {
    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      insights,
      riskLevel: calculateRiskLevel(insights),
      clausesIdentified: 10, // This could be dynamic based on actual analysis
      status: 'Completed',
      pdfUrl
    };

    // Upload the analysis report to Supabase storage
    const reportUrl = await uploadAnalysisReport(entry, entry.id);
    entry.reportUrl = reportUrl;
  } catch (error) {
    console.error('Failed to save to history:', error);
    throw error;
  }
};

export const getHistory = async (): Promise<HistoryEntry[]> => {
  try {
    const reports = await listAnalysisReports();
    const history: HistoryEntry[] = [];

    for (const report of reports) {
      try {
        // Skip files named "Unnamed file"
        if (report.fileName.toLowerCase().includes('unnamed')) {
          continue;
        }

        // Extract the base name without timestamp and extension
        const baseName = report.fileName.replace(/^\d+-/, '').replace('.json', '');
        const content = await getAnalysisReport(baseName);
        
        // Only add entries that have both a reportUrl and pdfUrl
        if (content.pdfUrl && report.url) {
          history.push({
            ...content,
            reportUrl: report.url
          });
        }
      } catch (error) {
        console.error(`Failed to load report ${report.fileName}:`, error);
      }
    }

    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Failed to get history:', error);
    return [];
  }
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const calculateRiskLevel = (insights: MistralResponse): string => {
  const riskScore = insights.final_verdict.risk_factor;
  if (riskScore >= 8) return 'High Risk';
  if (riskScore >= 5) return 'Medium Risk';
  return 'Low Risk';
}; 