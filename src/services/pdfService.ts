import * as pdfjs from 'pdfjs-dist';
import { supabase } from "@/integrations/supabase/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createWorker } from 'tesseract.js';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Initialize Gemini API with the correct API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Extract text from a PDF file, including text in images
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
    
    // Initialize Tesseract worker with minimal configuration
    const worker = await createWorker();
    
    // Load English language data
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    // Loop through each page and extract text
    for (let i = 1; i <= numPages; i++) {
      console.log(`Processing page ${i} of ${numPages}...`);
      const page = await pdf.getPage(i);
      
      // Extract regular text content
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      console.log(`Regular text extracted from page ${i}: ${pageText.length} characters`);
      
      // Extract images from the page using a more reliable method
      let imageText = '';
      
      try {
        // Create a canvas to render the page
        const canvas = document.createElement('canvas');
        const viewport = page.getViewport({ scale: 2.0 }); // Slightly lower scale to avoid memory issues
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Render the page to the canvas
        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Perform OCR on the entire page
        console.log(`Starting OCR on page ${i}...`);
        const { data: { text } } = await worker.recognize(canvas);
        if (text && text.trim()) {
          imageText = text;
          console.log(`OCR extracted ${imageText.length} characters from page ${i}`);
        }
      } catch (imgError) {
        console.error(`Error processing page ${i} with OCR:`, imgError);
      }
      
      // Combine regular text and OCR text
      fullText += `--- PAGE ${i} ---\n`;
      fullText += pageText + '\n';
      if (imageText) {
        fullText += `--- OCR TEXT FROM PAGE ${i} ---\n`;
        fullText += imageText + '\n';
      }
      fullText += '\n\n';
    }
    
    // Terminate the Tesseract worker
    await worker.terminate();
    
    console.log(`Total extracted text: ${fullText.length} characters`);
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
    // Initialize the model with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create the prompt for analysis
    const prompt = `Analyze the following pitch deck text and extract key information in a structured format. 
    Focus on these aspects:
    1. Innovation: What is the main innovative aspect?
    2. Industry: Which industry or sector does this belong to?
    3. Problem: What problem does it solve?
    4. Solution: How does it solve the problem?
    5. Funding: What are the funding requirements or financial aspects?
    6. Market: What is the market size and opportunity?

    The text includes both regular PDF text and OCR-extracted text from images. Please analyze ALL content thoroughly.
    
    Here's the pitch deck text:
    ${text}

    Please provide the analysis in a JSON format with these exact keys: innovation, industry, problem, solution, funding, market.
    Return ONLY the JSON object without any markdown formatting or code blocks.`;

    // Generate content with proper error handling
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();
    
    try {
      // Clean the response text to handle markdown formatting
      let cleanJsonText = analysisText;
      
      // Remove markdown code block syntax if present
      cleanJsonText = cleanJsonText.replace(/```json\s*/g, '');
      cleanJsonText = cleanJsonText.replace(/```\s*$/g, '');
      
      // Try to parse the cleaned response as JSON
      const parsedResponse = JSON.parse(cleanJsonText);
      
      // Validate and return the response
      return {
        innovation: parsedResponse.innovation || "Information not found in the pitch deck.",
        industry: parsedResponse.industry || "Information not found in the pitch deck.",
        problem: parsedResponse.problem || "Information not found in the pitch deck.",
        solution: parsedResponse.solution || "Information not found in the pitch deck.",
        funding: parsedResponse.funding || "Information not found in the pitch deck.",
        market: parsedResponse.market || "Information not found in the pitch deck."
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response:', analysisText);
      
      // If JSON parsing fails, try to extract information using regex
      try {
        // Attempt to extract JSON from the response using regex
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedJson = jsonMatch[0];
          const parsedResponse = JSON.parse(extractedJson);
          
          return {
            innovation: parsedResponse.innovation || "Information not found in the pitch deck.",
            industry: parsedResponse.industry || "Information not found in the pitch deck.",
            problem: parsedResponse.problem || "Information not found in the pitch deck.",
            solution: parsedResponse.solution || "Information not found in the pitch deck.",
            funding: parsedResponse.funding || "Information not found in the pitch deck.",
            market: parsedResponse.market || "Information not found in the pitch deck."
          };
        }
      } catch (extractionError) {
        console.error('Error extracting JSON from response:', extractionError);
      }
      
      // If all parsing attempts fail, return a structured error
      return {
        innovation: "Error processing the response. Please try again.",
        industry: "Error processing the response. Please try again.",
        problem: "Error processing the response. Please try again.",
        solution: "Error processing the response. Please try again.",
        funding: "Error processing the response. Please try again.",
        market: "Error processing the response. Please try again."
      };
    }
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    throw new Error('Failed to analyze the pitch deck. Please try again.');
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
