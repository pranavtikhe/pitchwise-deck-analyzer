
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
 * Analyze text using Google Gemini API
 */
export const analyzeWithGemini = async (text: string, apiKey: string): Promise<GeminiResponse> => {
  try {
    // Base URL for Gemini API
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    // Create the prompt for Gemini
    const prompt = `
      Analyze the following pitch deck text and extract key business insights. 
      Return the analysis as a JSON object with the following structure:
      {
        "innovation": "Brief description of the innovative aspects",
        "industry": "The industry sector and relevant verticals",
        "problem": "Key problem(s) the business is trying to solve",
        "solution": "How the business solves the identified problems",
        "funding": "Information about current funding, investment needs, or financial projections",
        "market": "Target market information, market size, growth potential"
      }
      
      Make each section concise (2-3 sentences) but informative. Ensure the response is strictly JSON formatted.
      
      Pitch deck text:
      ${text.substring(0, 14000)}
    `;
    
    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024
      }
    };
    
    // Make the API request
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const responseData = await response.json();
    
    // Extract the JSON response from the text
    const responseText = responseData.candidates[0]?.content?.parts[0]?.text || '';
    
    // Try to parse the JSON from the response
    try {
      // Find JSON content within the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      
      const jsonData = JSON.parse(jsonMatch[0]);
      
      // Validate that all required fields exist
      const requiredFields = ['innovation', 'industry', 'problem', 'solution', 'funding', 'market'];
      for (const field of requiredFields) {
        if (!jsonData[field]) {
          jsonData[field] = "Information not found in the pitch deck.";
        }
      }
      
      return jsonData as GeminiResponse;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse the analysis results. Please try again.');
    }
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    throw error;
  }
};
