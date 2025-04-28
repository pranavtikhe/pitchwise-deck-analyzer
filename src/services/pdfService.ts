import * as pdfjs from 'pdfjs-dist';
import { supabase } from "@/integrations/supabase/client";
import { createWorker } from 'tesseract.js';
import { analyzePitchDeck } from './apiService';

// Import Supabase URL and key
const SUPABASE_URL = "https://objyddwihcupdeflwcty.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ianlkZHdpaGN1cGRlZmx3Y3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjIyMTQsImV4cCI6MjA2MDEzODIxNH0.ZBgd87fJfL7lSWMxcsIx-F9PfkpLaRDSUCr5ZcG8zFI";

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
 * Interface for the response from Mistral API
 */
export interface MistralResponse {
  industry_type: string;
  pitch_clarity: number;
  investment_score: number;
  market_position: string;
  market_analysis: {
    market_size: string;
    growth_rate: string;
    trends: string[];
    challenges: string[];
  };
  company_overview: {
    company_name: string;
    industry: string;
    business_model: string;
    key_offerings: string;
    market_position: string;
    founded_on: string;
  };
  strengths: string[];
  weaknesses: string[];
  funding_history: {
    rounds: {
      type: string;
      amount: string;
      key_investors: string[];
    }[];
  };
  competitor_analysis: {
    competitors: {
      name: string;
      key_investors: string;
      amount_raised: string;
      market_position: string;
      strengths: string;
    }[];
  };
  market_comparison: {
    metrics: {
      startup: {
        growth_rate: string;
        market_share: string;
        revenue_model: string;
        differentiator: string;
      };
      competitors: {
        growth_rate: string;
        market_share: string;
        revenue_model: string;
        differentiator: string;
      }[];
    };
  };
  expert_opinions: {
    name: string;
    affiliation: string;
    summary: string;
    reference: string;
    date: string;
  }[];
  reputation_analysis: {
    news_media: {
      sentiment: string;
      score: number;
      rating: number;
    };
    social_media: {
      sentiment: string;
      score: number;
      rating: number;
    };
    investor_reviews: {
      sentiment: string;
      score: number;
      rating: number;
    };
    customer_feedback: {
      sentiment: string;
      score: number;
      rating: number;
    };
    overall: {
      sentiment: string;
      score: number;
      rating: number;
    };
  };
  proposed_deal_structure: {
    investment_amount: string;
    valuation_cap: string;
    equity_stake: string;
    liquidation_preference: string;
    anti_dilution_protection: string;
    board_seat: string;
    vesting_schedule: string;
    other_terms: string;
  };
  key_questions: {
    market_strategy: {
      question: string;
      answer: string;
    };
    user_retention: {
      question: string;
      answer: string;
    };
    regulatory_risks: {
      question: string;
      answer: string;
    };
  };
  final_verdict: {
    product_viability: number;
    market_potential: number;
    sustainability: number;
    innovation: number;
    exit_potential: number;
    risk_factor: number;
    competitive_edge: number;
  };
  analyzedAt: Date;
}

/**
 * Analyze text using Mistral API
 */
export const analyzeWithBackend = async (text: string): Promise<MistralResponse & { analyzedAt: Date }> => {
  try {
    console.log('Starting pitch deck analysis...');
    const analysis = await analyzePitchDeck(text);
    
    // Add analyzedAt field if not present
    if (!analysis.analyzedAt) {
      analysis.analyzedAt = new Date();
    }
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing with backend:', error);
    throw new Error('Analysis failed');
  }
};

/**
 * Save insights to Supabase
 */
export const saveInsightsToSupabase = async (
  insights: MistralResponse, 
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

