import { MistralResponse } from './pdfService';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  insights: MistralResponse;
  riskLevel: string;
  clausesIdentified: number;
  status: 'Completed' | 'Failed' | 'In Progress';
}

const HISTORY_STORAGE_KEY = 'pitch-deck-analysis-history';

export const saveToHistory = (insights: MistralResponse): void => {
  try {
    const history = getHistory();
    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      insights,
      riskLevel: calculateRiskLevel(insights),
      clausesIdentified: 10, // This could be dynamic based on actual analysis
      status: 'Completed'
    };

    history.unshift(entry); // Add new entry at the beginning
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
};

export const getHistory = (): HistoryEntry[] => {
  try {
    const history = localStorage.getItem(HISTORY_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
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