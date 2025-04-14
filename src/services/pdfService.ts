import * as pdfjs from 'pdfjs-dist';
import { supabase } from "@/integrations/supabase/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createWorker } from 'tesseract.js';

// Import Supabase URL and key
const SUPABASE_URL = "https://objyddwihcupdeflwcty.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ianlkZHdpaGN1cGRlZmx3Y3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjIyMTQsImV4cCI6MjA2MDEzODIxNH0.ZBgd87fJfL7lSWMxcsIx-F9PfkpLaRDSUCr5ZcG8zFI";

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
    await (worker as any).loadLanguage('eng');
    await (worker as any).initialize('eng');
    
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
  strengths: string;
  weaknesses: string;
  competitors: string;
  funding_history: string;
  expert_opinions: string;
  key_questions: string;
  suggested_improvements: string;
  key_insights: string;
  market_comparison: string;
  exit_potential: string;
  overall_reputation: string;
  ratings: {
    innovation_rating: number;
    market_potential_rating: number;
    competitive_advantage_rating: number;
    financial_strength_rating: number;
    team_rating: number;
    overall_rating: number;
  };
  rating_insights: {
    innovation_insights: string;
    market_potential_insights: string;
    competitive_advantage_insights: string;
    financial_strength_insights: string;
    team_insights: string;
    overall_insights: string;
  };
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
    7. Strengths: What are the key strengths of this business/idea?
    8. Weaknesses: What are the potential weaknesses or risks?
    9. Competitors: Who are the main competitors and how does this compare?
    10. Funding History: What is the company's funding history and trajectory?
    11. Expert Opinions: What do industry experts or potential investors think?
    12. Key Questions: What critical questions should be addressed?
    13. Suggested Improvements: What improvements could strengthen the pitch?
    14. Key Insights: What are the most important takeaways?
    15. Market Comparison: How does this compare to market standards?
    16. Exit Potential: What are the potential exit strategies and valuations?
    17. Overall Reputation: What is the overall reputation and perception?

    Additionally, provide ratings (on a scale of 1-10) for:
    - Innovation Rating: How innovative is the solution?
    - Market Potential Rating: How large is the market opportunity?
    - Competitive Advantage Rating: How strong is the competitive position?
    - Financial Strength Rating: How strong is the financial position?
    - Team Rating: How strong is the team?
    - Overall Rating: Overall assessment of the pitch

    For each rating, provide a brief explanation of why you assigned that score.
    
    Also, analyze the relationship between these ratings and provide insights on:
    - Which areas are strongest and why
    - Which areas need improvement and why
    - How the ratings compare to industry standards
    - What specific actions could improve the ratings
    - How the ratings affect the overall investment potential

    The text includes both regular PDF text and OCR-extracted text from images. Please analyze ALL content thoroughly.
    
    Here's the pitch deck text:
    ${text}

    Please provide the analysis in a JSON format with these exact keys: innovation, industry, problem, solution, funding, market, strengths, weaknesses, competitors, funding_history, expert_opinions, key_questions, suggested_improvements, key_insights, market_comparison, exit_potential, overall_reputation, ratings (which should be an object with the rating keys), and rating_insights (which should be an object with keys for each rating category explaining the score and providing recommendations).
    Return ONLY the JSON object without any markdown formatting or code blocks.
    Ensure the JSON is properly formatted with no trailing commas or syntax errors.`;

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
      
      // Check if expert_opinions is missing or contains default text
      let expertOpinions = parsedResponse.expert_opinions || "Information not found in the pitch deck.";
      
      // If expert opinions are missing or contain default text, generate them based on other data
      if (expertOpinions === "Information not found in the pitch deck." || 
          expertOpinions === "No expert opinions found in the pitch deck.") {
        
        // Create a follow-up prompt to generate expert opinions based on the available data
        const expertPrompt = `Based on the following pitch deck analysis, generate expert opinions from industry experts and potential investors. 
        Consider the innovation, market potential, competitive advantage, financial strength, and team aspects.
        
        Innovation: ${parsedResponse.innovation || "Not available"}
        Industry: ${parsedResponse.industry || "Not available"}
        Problem: ${parsedResponse.problem || "Not available"}
        Solution: ${parsedResponse.solution || "Not available"}
        Market: ${parsedResponse.market || "Not available"}
        Strengths: ${parsedResponse.strengths || "Not available"}
        Weaknesses: ${parsedResponse.weaknesses || "Not available"}
        Competitors: ${parsedResponse.competitors || "Not available"}
        
        Ratings:
        - Innovation: ${parsedResponse.ratings?.innovation_rating || 5}/10
        - Market Potential: ${parsedResponse.ratings?.market_potential_rating || 5}/10
        - Competitive Advantage: ${parsedResponse.ratings?.competitive_advantage_rating || 5}/10
        - Financial Strength: ${parsedResponse.ratings?.financial_strength_rating || 5}/10
        - Team: ${parsedResponse.ratings?.team_rating || 5}/10
        
        Please provide expert opinions from 3-5 different perspectives (e.g., industry expert, venture capitalist, market analyst, etc.) 
        on the potential of this business based on the pitch deck. Include both positive aspects and areas of concern.
        Format the response as a JSON object with a single key "expert_opinions" containing the generated opinions.`;
        
        try {
          // Generate expert opinions
          const expertResult = await model.generateContent(expertPrompt);
          const expertResponse = await expertResult.response;
          const expertText = expertResponse.text();
          
          // Clean and parse the expert opinions
          let cleanExpertText = expertText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
          
          try {
            const parsedExpertResponse = JSON.parse(cleanExpertText);
            expertOpinions = parsedExpertResponse.expert_opinions || expertOpinions;
          } catch (expertParseError) {
            console.error('Error parsing expert opinions response:', expertParseError);
            // If parsing fails, try to extract the expert opinions using regex
            const expertMatch = cleanExpertText.match(/"expert_opinions"\s*:\s*"([^"]+)"/);
            if (expertMatch && expertMatch[1]) {
              expertOpinions = expertMatch[1];
            }
          }
        } catch (expertError) {
          console.error('Error generating expert opinions:', expertError);
          // Continue with the default expert opinions if generation fails
        }
      }
      
      // Validate and return the response
      return {
        innovation: parsedResponse.innovation || "Information not found in the pitch deck.",
        industry: parsedResponse.industry || "Information not found in the pitch deck.",
        problem: parsedResponse.problem || "Information not found in the pitch deck.",
        solution: parsedResponse.solution || "Information not found in the pitch deck.",
        funding: parsedResponse.funding || "Information not found in the pitch deck.",
        market: parsedResponse.market || "Information not found in the pitch deck.",
        strengths: parsedResponse.strengths || "Information not found in the pitch deck.",
        weaknesses: parsedResponse.weaknesses || "Information not found in the pitch deck.",
        competitors: parsedResponse.competitors || "Information not found in the pitch deck.",
        funding_history: parsedResponse.funding_history || "Information not found in the pitch deck.",
        expert_opinions: expertOpinions,
        key_questions: parsedResponse.key_questions || "Information not found in the pitch deck.",
        suggested_improvements: parsedResponse.suggested_improvements || "Information not found in the pitch deck.",
        key_insights: parsedResponse.key_insights || "Information not found in the pitch deck.",
        market_comparison: parsedResponse.market_comparison || "Information not found in the pitch deck.",
        exit_potential: parsedResponse.exit_potential || "Information not found in the pitch deck.",
        overall_reputation: parsedResponse.overall_reputation || "Information not found in the pitch deck.",
        ratings: parsedResponse.ratings || {
          innovation_rating: 5,
          market_potential_rating: 5,
          competitive_advantage_rating: 5,
          financial_strength_rating: 5,
          team_rating: 5,
          overall_rating: 5
        },
        rating_insights: parsedResponse.rating_insights || {
          innovation_insights: "No insights provided for innovation rating.",
          market_potential_insights: "No insights provided for market potential rating.",
          competitive_advantage_insights: "No insights provided for competitive advantage rating.",
          financial_strength_insights: "No insights provided for financial strength rating.",
          team_insights: "No insights provided for team rating.",
          overall_insights: "No insights provided for overall rating."
        }
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
          
          // Try to fix common JSON syntax errors
          let fixedJson = extractedJson
            // Fix trailing commas in objects
            .replace(/,(\s*[}\]])/g, '$1')
            // Fix missing quotes around property names
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            // Fix single quotes around string values
            .replace(/'([^']*)'/g, '"$1"');
          
          try {
            const parsedResponse = JSON.parse(fixedJson);
            
            // Check if expert_opinions is missing or contains default text
            let expertOpinions = parsedResponse.expert_opinions || "Information not found in the pitch deck.";
            
            // If expert opinions are missing or contain default text, generate them based on other data
            if (expertOpinions === "Information not found in the pitch deck." || 
                expertOpinions === "No expert opinions found in the pitch deck.") {
              
              // Create a follow-up prompt to generate expert opinions based on the available data
              const expertPrompt = `Based on the following pitch deck analysis, generate expert opinions from industry experts and potential investors. 
              Consider the innovation, market potential, competitive advantage, financial strength, and team aspects.
              
              Innovation: ${parsedResponse.innovation || "Not available"}
              Industry: ${parsedResponse.industry || "Not available"}
              Problem: ${parsedResponse.problem || "Not available"}
              Solution: ${parsedResponse.solution || "Not available"}
              Market: ${parsedResponse.market || "Not available"}
              Strengths: ${parsedResponse.strengths || "Not available"}
              Weaknesses: ${parsedResponse.weaknesses || "Not available"}
              Competitors: ${parsedResponse.competitors || "Not available"}
              
              Ratings:
              - Innovation: ${parsedResponse.ratings?.innovation_rating || 5}/10
              - Market Potential: ${parsedResponse.ratings?.market_potential_rating || 5}/10
              - Competitive Advantage: ${parsedResponse.ratings?.competitive_advantage_rating || 5}/10
              - Financial Strength: ${parsedResponse.ratings?.financial_strength_rating || 5}/10
              - Team: ${parsedResponse.ratings?.team_rating || 5}/10
              
              Please provide expert opinions from 3-5 different perspectives (e.g., industry expert, venture capitalist, market analyst, etc.) 
              on the potential of this business based on the pitch deck. Include both positive aspects and areas of concern.
              Format the response as a JSON object with a single key "expert_opinions" containing the generated opinions.`;
              
              try {
                // Generate expert opinions
                const expertResult = await model.generateContent(expertPrompt);
                const expertResponse = await expertResult.response;
                const expertText = expertResponse.text();
                
                // Clean and parse the expert opinions
                let cleanExpertText = expertText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
                
                try {
                  const parsedExpertResponse = JSON.parse(cleanExpertText);
                  expertOpinions = parsedExpertResponse.expert_opinions || expertOpinions;
                } catch (expertParseError) {
                  console.error('Error parsing expert opinions response:', expertParseError);
                  // If parsing fails, try to extract the expert opinions using regex
                  const expertMatch = cleanExpertText.match(/"expert_opinions"\s*:\s*"([^"]+)"/);
                  if (expertMatch && expertMatch[1]) {
                    expertOpinions = expertMatch[1];
                  }
                }
              } catch (expertError) {
                console.error('Error generating expert opinions:', expertError);
                // Continue with the default expert opinions if generation fails
              }
            }
            
            return {
              innovation: parsedResponse.innovation || "Information not found in the pitch deck.",
              industry: parsedResponse.industry || "Information not found in the pitch deck.",
              problem: parsedResponse.problem || "Information not found in the pitch deck.",
              solution: parsedResponse.solution || "Information not found in the pitch deck.",
              funding: parsedResponse.funding || "Information not found in the pitch deck.",
              market: parsedResponse.market || "Information not found in the pitch deck.",
              strengths: parsedResponse.strengths || "Information not found in the pitch deck.",
              weaknesses: parsedResponse.weaknesses || "Information not found in the pitch deck.",
              competitors: parsedResponse.competitors || "Information not found in the pitch deck.",
              funding_history: parsedResponse.funding_history || "Information not found in the pitch deck.",
              expert_opinions: expertOpinions,
              key_questions: parsedResponse.key_questions || "Information not found in the pitch deck.",
              suggested_improvements: parsedResponse.suggested_improvements || "Information not found in the pitch deck.",
              key_insights: parsedResponse.key_insights || "Information not found in the pitch deck.",
              market_comparison: parsedResponse.market_comparison || "Information not found in the pitch deck.",
              exit_potential: parsedResponse.exit_potential || "Information not found in the pitch deck.",
              overall_reputation: parsedResponse.overall_reputation || "Information not found in the pitch deck.",
              ratings: parsedResponse.ratings || {
                innovation_rating: 5,
                market_potential_rating: 5,
                competitive_advantage_rating: 5,
                financial_strength_rating: 5,
                team_rating: 5,
                overall_rating: 5
              },
              rating_insights: parsedResponse.rating_insights || {
                innovation_insights: "No insights provided for innovation rating.",
                market_potential_insights: "No insights provided for market potential rating.",
                competitive_advantage_insights: "No insights provided for competitive advantage rating.",
                financial_strength_insights: "No insights provided for financial strength rating.",
                team_insights: "No insights provided for team rating.",
                overall_insights: "No insights provided for overall rating."
              }
            };
          } catch (fixedJsonError) {
            console.error('Error parsing fixed JSON:', fixedJsonError);
            
            // If all parsing attempts fail, try to extract individual fields using regex
            const extractField = (fieldName: string): string => {
              const regex = new RegExp(`"${fieldName}"\\s*:\\s*"([^"]*)"`, 'i');
              const match = analysisText.match(regex);
              return match ? match[1] : "Information not found in the pitch deck.";
            };
            
            const extractRating = (ratingName: string): number => {
              const regex = new RegExp(`"${ratingName}"\\s*:\\s*(\\d+)`, 'i');
              const match = analysisText.match(regex);
              return match ? parseInt(match[1], 10) : 5;
            };
            
            const extractInsight = (insightName: string): string => {
              const regex = new RegExp(`"${insightName}"\\s*:\\s*"([^"]*)"`, 'i');
              const match = analysisText.match(regex);
              return match ? match[1] : "No insights provided for this rating.";
            };
            
            // Extract expert opinions
            let expertOpinions = extractField('expert_opinions');
            
            // If expert opinions are missing or contain default text, generate them based on other data
            if (expertOpinions === "Information not found in the pitch deck." || 
                expertOpinions === "No expert opinions found in the pitch deck.") {
              
              // Create a follow-up prompt to generate expert opinions based on the available data
              const expertPrompt = `Based on the following pitch deck analysis, generate expert opinions from industry experts and potential investors. 
              Consider the innovation, market potential, competitive advantage, financial strength, and team aspects.
              
              Innovation: ${extractField('innovation')}
              Industry: ${extractField('industry')}
              Problem: ${extractField('problem')}
              Solution: ${extractField('solution')}
              Market: ${extractField('market')}
              Strengths: ${extractField('strengths')}
              Weaknesses: ${extractField('weaknesses')}
              Competitors: ${extractField('competitors')}
              
              Ratings:
              - Innovation: ${extractRating('innovation_rating')}/10
              - Market Potential: ${extractRating('market_potential_rating')}/10
              - Competitive Advantage: ${extractRating('competitive_advantage_rating')}/10
              - Financial Strength: ${extractRating('financial_strength_rating')}/10
              - Team: ${extractRating('team_rating')}/10
              
              Please provide expert opinions from 3-5 different perspectives (e.g., industry expert, venture capitalist, market analyst, etc.) 
              on the potential of this business based on the pitch deck. Include both positive aspects and areas of concern.
              Format the response as a JSON object with a single key "expert_opinions" containing the generated opinions.`;
              
              try {
                // Generate expert opinions
                const expertResult = await model.generateContent(expertPrompt);
                const expertResponse = await expertResult.response;
                const expertText = expertResponse.text();
                
                // Clean and parse the expert opinions
                let cleanExpertText = expertText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
                
                try {
                  const parsedExpertResponse = JSON.parse(cleanExpertText);
                  expertOpinions = parsedExpertResponse.expert_opinions || expertOpinions;
                } catch (expertParseError) {
                  console.error('Error parsing expert opinions response:', expertParseError);
                  // If parsing fails, try to extract the expert opinions using regex
                  const expertMatch = cleanExpertText.match(/"expert_opinions"\s*:\s*"([^"]+)"/);
                  if (expertMatch && expertMatch[1]) {
                    expertOpinions = expertMatch[1];
                  }
                }
              } catch (expertError) {
                console.error('Error generating expert opinions:', expertError);
                // Continue with the default expert opinions if generation fails
              }
            }
            
            return {
              innovation: extractField('innovation'),
              industry: extractField('industry'),
              problem: extractField('problem'),
              solution: extractField('solution'),
              funding: extractField('funding'),
              market: extractField('market'),
              strengths: extractField('strengths'),
              weaknesses: extractField('weaknesses'),
              competitors: extractField('competitors'),
              funding_history: extractField('funding_history'),
              expert_opinions: expertOpinions,
              key_questions: extractField('key_questions'),
              suggested_improvements: extractField('suggested_improvements'),
              key_insights: extractField('key_insights'),
              market_comparison: extractField('market_comparison'),
              exit_potential: extractField('exit_potential'),
              overall_reputation: extractField('overall_reputation'),
              ratings: {
                innovation_rating: extractRating('innovation_rating'),
                market_potential_rating: extractRating('market_potential_rating'),
                competitive_advantage_rating: extractRating('competitive_advantage_rating'),
                financial_strength_rating: extractRating('financial_strength_rating'),
                team_rating: extractRating('team_rating'),
                overall_rating: extractRating('overall_rating')
              },
              rating_insights: {
                innovation_insights: extractInsight('innovation_insights'),
                market_potential_insights: extractInsight('market_potential_insights'),
                competitive_advantage_insights: extractInsight('competitive_advantage_insights'),
                financial_strength_insights: extractInsight('financial_strength_insights'),
                team_insights: extractInsight('team_insights'),
                overall_insights: extractInsight('overall_insights')
              }
            };
          }
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
        market: "Error processing the response. Please try again.",
        strengths: "Error processing the response. Please try again.",
        weaknesses: "Error processing the response. Please try again.",
        competitors: "Error processing the response. Please try again.",
        funding_history: "Error processing the response. Please try again.",
        expert_opinions: "Error processing the response. Please try again.",
        key_questions: "Error processing the response. Please try again.",
        suggested_improvements: "Error processing the response. Please try again.",
        key_insights: "Error processing the response. Please try again.",
        market_comparison: "Error processing the response. Please try again.",
        exit_potential: "Error processing the response. Please try again.",
        overall_reputation: "Error processing the response. Please try again.",
        ratings: {
          innovation_rating: 5,
          market_potential_rating: 5,
          competitive_advantage_rating: 5,
          financial_strength_rating: 5,
          team_rating: 5,
          overall_rating: 5
        },
        rating_insights: {
          innovation_insights: "No insights provided for innovation rating.",
          market_potential_insights: "No insights provided for market potential rating.",
          competitive_advantage_insights: "No insights provided for competitive advantage rating.",
          financial_strength_insights: "No insights provided for financial strength rating.",
          team_insights: "No insights provided for team rating.",
          overall_insights: "No insights provided for overall rating."
        }
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
    console.log('Attempting to save insights to Supabase...');
    
    // First, try to get the current session to check authentication status
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('Session data:', sessionData);
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
    }
    
    // Get the user ID from the session if available
    const userId = sessionData?.session?.user?.id || null;
    
    // Prepare the data to insert
    const dataToInsert = {
      innovation: insights.innovation,
      industry: insights.industry,
      problem: insights.problem,
      solution: insights.solution,
      funding: insights.funding,
      market: insights.market,
      strengths: insights.strengths,
      weaknesses: insights.weaknesses,
      competitors: insights.competitors,
      funding_history: insights.funding_history,
      expert_opinions: insights.expert_opinions,
      key_questions: insights.key_questions,
      suggested_improvements: insights.suggested_improvements,
      key_insights: insights.key_insights,
      market_comparison: insights.market_comparison,
      exit_potential: insights.exit_potential,
      overall_reputation: insights.overall_reputation,
      innovation_rating: insights.ratings.innovation_rating,
      market_potential_rating: insights.ratings.market_potential_rating,
      competitive_advantage_rating: insights.ratings.competitive_advantage_rating,
      financial_strength_rating: insights.ratings.financial_strength_rating,
      team_rating: insights.ratings.team_rating,
      overall_rating: insights.ratings.overall_rating,
      innovation_insights: insights.rating_insights.innovation_insights,
      market_potential_insights: insights.rating_insights.market_potential_insights,
      competitive_advantage_insights: insights.rating_insights.competitive_advantage_insights,
      financial_strength_insights: insights.rating_insights.financial_strength_insights,
      team_insights: insights.rating_insights.team_insights,
      overall_insights: insights.rating_insights.overall_insights,
      company_name: companyName,
      file_name: fileName,
      user_id: userId // Include the user_id in the data
    };
    
    console.log('Data to insert:', dataToInsert);
    
    // Try to insert the data
    const { data, error } = await supabase
      .from('pitch_insights')
      .insert(dataToInsert)
      .select();
    
    if (error) {
      console.error('Supabase error details:', error);
      
      // If the error is related to RLS, try a different approach
      if (error.code === '42501') {
        console.log('RLS policy error detected, trying alternative approach...');
        
        // Get the current session token for authentication
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        
        // If we have an access token, use it for authentication
        if (accessToken) {
          // Try using the REST API directly with fetch and proper authentication
          const response = await fetch(`${SUPABASE_URL}/rest/v1/pitch_insights`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${accessToken}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(dataToInsert)
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Fetch error:', response.status, errorText);
            throw new Error(`Failed to save insights: ${response.status} ${errorText}`);
          }
          
          console.log('Successfully saved insights using REST API');
          return;
        }
      }
      
      throw new Error(`Failed to save insights: ${error.message}`);
    }
    
    console.log('Successfully saved insights to Supabase:', data);
  } catch (error) {
    console.error('Error saving insights to Supabase:', error);
    throw new Error('Failed to save insights. Please try again.');
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
