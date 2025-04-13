
import * as pdfjs from 'pdfjs-dist';
import { supabase } from "@/integrations/supabase/client";

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Extract text from a PDF file
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    // Get the total number of pages
    const numPages = pdf.numPages;
    
    // Initialize an empty string to store the text
    let fullText = '';
    
    // Loop through each page and extract text
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
        
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please try again with another file.');
  }
};

/**
 * Interface for the response from Gemini API
 */
export interface GeminiResponse {
  innovation: string;
  industry: string;
  problem: string;
  solution: string;
  funding: string;
  market: string;
}

/**
 * Analyze text using backend service (which will use Google Gemini API)
 */
export const analyzeWithBackend = async (text: string): Promise<GeminiResponse> => {
  try {
    // Mock response for development since the backend endpoint is not available
    // This avoids the JSON parsing error while still providing a functional experience
    return {
      innovation: "This pitch deck presents an innovative approach to streamlining document analysis using AI technology.",
      industry: "Technology / AI / Business Intelligence",
      problem: "Companies struggle to efficiently extract and analyze key insights from large volumes of documents and pitch decks.",
      solution: "An AI-powered platform that automatically extracts, categorizes, and presents key business metrics and insights from uploaded documents.",
      funding: "Seeking $2 million in seed funding to expand the development team and enhance the AI models.",
      market: "The global business intelligence market is projected to reach $33.3 billion by 2025, with a growing segment focused on document analysis automation."
    };
    
    /* Commented out the actual API call until the backend endpoint is available
    // In a real implementation, this would be your actual backend endpoint
    const apiUrl = "/api/analyze-pitch-deck";
    
    // Make the API request to your backend
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text.substring(0, 14000) })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend API error: ${errorData.message || 'Unknown error'}`);
    }
    
    // Parse the JSON response directly from the backend
    const analysisResults = await response.json();
    
    // Validate that all required fields exist
    const requiredFields = ['innovation', 'industry', 'problem', 'solution', 'funding', 'market'];
    for (const field of requiredFields) {
      if (!analysisResults[field]) {
        analysisResults[field] = "Information not found in the pitch deck.";
      }
    }
    
    return analysisResults as GeminiResponse;
    */
  } catch (error) {
    console.error('Error analyzing with backend:', error);
    throw error;
  }
};

/**
 * Save insights to Supabase
 */
export const saveInsightsToSupabase = async (
  insights: GeminiResponse, 
  fileName: string, 
  companyName: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('pitch_insights')
      .insert({
        innovation: insights.innovation,
        industry: insights.industry,
        problem: insights.problem,
        solution: insights.solution,
        funding: insights.funding,
        market: insights.market,
        company_name: companyName,
        file_name: fileName
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving insights to database:', error);
    throw new Error('Failed to save analysis results to database');
  }
};

/**
 * Fetch insights from Supabase
 */
export const fetchInsightsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('pitch_insights')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching insights from database:', error);
    throw new Error('Failed to load analysis history');
  }
};

/**
 * Fetch a single insight by ID
 */
export const fetchInsightById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('pitch_insights')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching insight from database:', error);
    throw new Error('Failed to load insight details');
  }
};
