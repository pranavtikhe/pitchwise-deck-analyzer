import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { MistralResponse } from './pdfService'

// Initialize Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

// Initialize Deep Research 2.5 model
const deepResearchModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.2,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }
  ]
})

/**
 * Analyze pitch deck text using Google's Gemini API
 */
export const analyzePitchDeck = async (text: string): Promise<MistralResponse & { analyzedAt: Date }> => {
  try {
    // Get the generative model with the specified model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    // Create the prompt for analysis
    const prompt = `Analyze the following pitch deck text and provide a detailed structured analysis.
    Focus on extracting information about the company, its business model, market position, key strengths and weaknesses, 
    funding history, and provide an investment recommendation. 
    
    If information is not explicitly available in the text, make reasonable assumptions based on industry standards 
    but highlight when you're making an assumption.
    
    Here's the pitch deck text:
    ${text}
    
    Please provide your analysis in the following JSON format (include all these fields even if you need to use placeholder values):
    
    {
      "industry_type": "",
      "pitch_clarity": 7,
      "investment_score": 7,
      "market_position": "",
  "company_overview": {
        "company_name": "",
        "industry": "",
        "business_model": "",
        "key_offerings": "",
        "market_position": "",
        "founded_on": ""
      },
      "strengths": ["", "", ""],
      "weaknesses": ["", "", ""],
  "funding_history": {
    "rounds": [
      {
            "type": "Seed",
            "amount": "$X million",
            "key_investors": ["Investor1", "Investor2"]
      }
    ]
  },
  "proposed_deal_structure": {
        "investment_amount": "",
        "valuation_cap": "",
        "equity_stake": "",
        "anti_dilution_protection": "",
        "board_seat": "",
        "liquidation_preference": "",
        "vesting_schedule": "",
        "other_terms": ""
  },
  "key_questions": {
        "market_strategy": [""],
        "user_relation": [""],
        "regulatory_compliance": [""]
  },
  "final_verdict": {
        "product_viability": 7,
        "market_potential": 7,
        "sustainability": 7,
        "innovation": 7,
        "exit_potential": 7,
        "risk_factor": 5,
        "competitive_edge": 7
      },
      "innovation": "",
      "industry": "",
      "problem": "",
      "solution": "",
      "funding": "",
      "market": "",
      "competitors": ["", ""],
  "expert_opinions": [
    {
          "name": "Expert Name",
          "affiliation": "Expert Affiliation",
          "summary": "Expert Opinion",
          "reference": "Source",
          "date": "YYYY-MM-DD"
        }
      ],
      "suggested_improvements": ["", ""],
      "market_comparison": "",
      "key_insights": "",
      "exit_potential": "",
      "overall_reputation": "",
      "ratings": {
        "innovation_rating": 8,
        "market_potential_rating": 8,
        "competitive_advantage_rating": 7,
        "financial_strength_rating": 6,
        "team_rating": 8,
        "overall_rating": 7
      },
      "rating_insights": {
        "innovation_insights": "",
        "market_potential_insights": "",
        "competitive_advantage_insights": "",
        "financial_strength_insights": "",
        "team_insights": "",
        "overall_insights": ""
      },
  "market_analysis": {
        "market_size": "",
        "growth_rate": "",
        "trends": [""],
        "challenges": [""]
  },
  "competitor_analysis": {
    "competitors": [
      {
            "name": "",
            "key_investors": "",
            "amount_raised": "",
            "market_position": "",
            "strengths": ""
          }
        ]
      }
    }
    
    Provide ONLY the JSON output without any text before or after. Ensure all numeric scores are between 1-10.`

    // Generate content with Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysisText = response.text()
    
    // Clean the response text to handle markdown formatting
    let cleanJsonText = analysisText
    cleanJsonText = cleanJsonText.replace(/```json\s*/g, '')
    cleanJsonText = cleanJsonText.replace(/```\s*$/g, '')
    
    try {
      // Parse the JSON response
      const analysis = JSON.parse(cleanJsonText) as MistralResponse
      
      // Add analyzedAt field
      return {
        ...analysis,
        analyzedAt: new Date()
      }
    } catch (jsonError) {
      console.error('Error parsing Gemini response as JSON:', jsonError)
      throw new Error('Failed to parse analysis result')
    }
  } catch (error) {
    console.error('Error analyzing with Gemini:', error)
    throw new Error('Analysis failed')
  }
}

/**
 * Analyze pitch deck text using Deep Research 2.5 model
 */
export const analyzeWithDeepResearch = async (text: string): Promise<MistralResponse & { analyzedAt: Date }> => {
  try {
    // Create a more detailed prompt for deep research analysis
    const prompt = `You are Deep Research 2.5, an advanced AI model specialized in comprehensive pitch deck analysis.
    Perform a deep research analysis on the following pitch deck text with enhanced focus on:
    
    1. Market Analysis & Validation
    - Total Addressable Market (TAM) calculation
    - Serviceable Available Market (SAM) assessment
    - Market growth trends and projections
    - Customer segmentation and validation
    - Market entry barriers and challenges
    
    2. Competitive Landscape
    - Direct and indirect competitors analysis
    - Competitive advantage assessment
    - Market share analysis
    - SWOT analysis of key competitors
    - Differentiation strategy evaluation
    
    3. Financial Analysis
    - Revenue model validation
    - Cost structure analysis
    - Unit economics assessment
    - Financial projections review
    - Burn rate and runway analysis
    
    4. Team & Execution
    - Founder/team background analysis
    - Key personnel expertise assessment
    - Advisory board evaluation
    - Execution capability analysis
    - Hiring and scaling plans
    
    5. Technology & Innovation
    - Technology stack assessment
    - IP portfolio analysis
    - Technical scalability evaluation
    - Innovation differentiation
    - R&D pipeline analysis
    
    6. Risk Assessment
    - Market risks
    - Technology risks
    - Regulatory risks
    - Competitive risks
    - Operational risks
    - Mitigation strategies
    
    7. Investment Opportunity
    - Valuation analysis
    - Investment thesis validation
    - Exit strategy assessment
    - Return on investment projections
    - Investment terms analysis
    
    Here's the pitch deck text:
    ${text}
    
    Please provide your analysis in the following JSON format (include all these fields even if you need to use placeholder values):
    
    {
      "industry_type": "",
      "pitch_clarity": 7,
      "investment_score": 7,
      "market_position": "",
      "company_overview": {
        "company_name": "",
        "industry": "",
        "business_model": "",
        "key_offerings": "",
        "market_position": "",
        "founded_on": ""
      },
      "strengths": ["", "", ""],
      "weaknesses": ["", "", ""],
      "funding_history": {
        "rounds": [
          {
            "type": "Seed",
            "amount": "$X million",
            "key_investors": ["Investor1", "Investor2"]
          }
        ]
      },
      "proposed_deal_structure": {
        "investment_amount": "",
        "valuation_cap": "",
        "equity_stake": "",
        "anti_dilution_protection": "",
        "board_seat": "",
        "liquidation_preference": "",
        "vesting_schedule": "",
        "other_terms": ""
      },
      "key_questions": {
        "market_strategy": [""],
        "user_relation": [""],
        "regulatory_compliance": [""]
      },
      "final_verdict": {
        "product_viability": 7,
        "market_potential": 7,
        "sustainability": 7,
        "innovation": 7,
        "exit_potential": 7,
        "risk_factor": 5,
        "competitive_edge": 7
      },
      "innovation": "",
      "industry": "",
      "problem": "",
      "solution": "",
      "funding": "",
      "market": "",
      "competitors": ["", ""],
      "expert_opinions": [
        {
          "name": "Expert Name",
          "affiliation": "Expert Affiliation",
          "summary": "Expert Opinion",
          "reference": "Source",
          "date": "YYYY-MM-DD"
        }
      ],
      "suggested_improvements": ["", ""],
      "market_comparison": "",
      "key_insights": "",
      "exit_potential": "",
      "overall_reputation": "",
      "ratings": {
        "innovation_rating": 8,
        "market_potential_rating": 8,
        "competitive_advantage_rating": 7,
        "financial_strength_rating": 6,
        "team_rating": 8,
        "overall_rating": 7
      },
      "rating_insights": {
        "innovation_insights": "",
        "market_potential_insights": "",
        "competitive_advantage_insights": "",
        "financial_strength_insights": "",
        "team_insights": "",
        "overall_insights": ""
      },
      "market_analysis": {
        "market_size": "",
        "growth_rate": "",
        "trends": [""],
        "challenges": [""]
      },
      "competitor_analysis": {
        "competitors": [
          {
            "name": "",
            "key_investors": "",
            "amount_raised": "",
            "market_position": "",
            "strengths": ""
          }
        ]
      }
    }
    
    Provide ONLY the JSON output without any text before or after. Ensure all numeric scores are between 1-10.`

    // Generate content with Deep Research model
    const result = await deepResearchModel.generateContent(prompt)
    const response = await result.response
    const analysisText = response.text()
    
    // Clean the response text to handle markdown formatting
    let cleanJsonText = analysisText
    cleanJsonText = cleanJsonText.replace(/```json\s*/g, '')
    cleanJsonText = cleanJsonText.replace(/```\s*$/g, '')
    
    try {
      // Parse the JSON response
      const analysis = JSON.parse(cleanJsonText) as MistralResponse
      
      // Add analyzedAt field
      return {
        ...analysis,
        analyzedAt: new Date()
      }
    } catch (jsonError) {
      console.error('Error parsing Deep Research response as JSON:', jsonError)
      throw new Error('Failed to parse analysis result')
    }
  } catch (error) {
    console.error('Error analyzing with Deep Research:', error)
    throw new Error('Analysis failed')
  }
} 