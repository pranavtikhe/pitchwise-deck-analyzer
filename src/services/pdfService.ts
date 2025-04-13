
import * as pdfjs from 'pdfjs-dist';

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
  } catch (error) {
    console.error('Error analyzing with backend:', error);
    throw error;
  }
};
