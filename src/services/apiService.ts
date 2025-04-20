import { API_CONFIG } from '../config/api';

export const analyzePitchDeck = async (text: string) => {
  console.log('Starting pitch deck analysis with Mistral...');
  console.log(`Total characters to analyze: ${text.length}`);

  const prompt = `
    As an expert investment analyst and pitch deck evaluator, analyze this pitch deck comprehensively.
    Consider the following aspects and provide detailed insights:

    1. Industry Analysis:
       - Market size and growth potential
       - Competitive landscape
       - Industry trends and dynamics
       - Regulatory environment

    2. Company Overview:
       - Business model and value proposition
       - Target market and customer segments
       - Revenue model and monetization strategy
       - Team composition and expertise
       - Technology and IP position

    3. Financial Analysis:
       - Revenue projections and growth trajectory
       - Unit economics and margins
       - Cash flow and burn rate
       - Funding requirements and use of proceeds
       - Valuation methodology and assumptions

    4. Market Opportunity:
       - Total Addressable Market (TAM)
       - Serviceable Available Market (SAM)
       - Serviceable Obtainable Market (SOM)
       - Market penetration strategy
       - Competitive advantages

    5. Risk Assessment:
       - Market risks
       - Technology risks
       - Regulatory risks
       - Competition risks
       - Execution risks

    6. Investment Thesis:
       - Key investment highlights
       - Growth potential
       - Exit opportunities
       - Return on investment projections

    Return the analysis in the following JSON format. For any missing information, make educated inferences based on:
    - Industry standards and benchmarks
    - Comparable companies
    - Market conditions
    - Company stage and maturity

    Required JSON format:
    {
      "industry_type": "string",
      "pitch_clarity": number,
      "investment_score": number,
      "market_position": "string",
      "company_overview": {
        "company_name": "string",
        "industry": "string",
        "business_model": "string",
        "key_offerings": "string",
        "market_position": "string",
        "founded_on": "string"
      },
      "strengths": string[],
      "weaknesses": string[],
      "funding_history": {
        "rounds": [
          {
            "type": "string",
            "amount": "string",
            "key_investors": string[]
          }
        ]
      },
      "proposed_deal_structure": {
        "investment_amount": "string",
        "valuation_cap": "string",
        "equity_stake": "string",
        "anti_dilution_protection": "string",
        "board_seat": "string",
        "liquidation_preference": "string",
        "vesting_schedule": "string",
        "other_terms": "string"
      },
      "key_questions": {
        "market_strategy": string[],
        "user_relation": string[],
        "regulatory_compliance": string[]
      },
      "final_verdict": {
        "product_viability": number,
        "market_potential": number,
        "sustainability": number,
        "innovation": number,
        "exit_potential": number,
        "risk_factor": number,
        "competitive_edge": number
      },
      "expert_opinions": string[],
      "market_analysis": {
        "market_size": "string",
        "growth_rate": "string",
        "trends": string[],
        "challenges": string[]
      },
      "competitor_analysis": {
        "direct_competitors": string[],
        "competitive_advantages": string[],
        "market_share": "string",
        "differentiators": string[]
      }
    }

    Pitch Deck Text: ${text}`;

  try {
    console.log('Sending request to Mistral API...');
    
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      console.error('Mistral API request failed:', response.status, response.statusText);
      throw new Error(`Analysis failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log('Successfully received Mistral response');

    try {
      // Extract and clean the JSON response
      const analysisText = result.choices[0].message.content;
      let cleanJsonText = analysisText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      
      // Parse the JSON response
      const parsedData = JSON.parse(cleanJsonText);
      console.log('Successfully parsed analysis JSON');
      
      // Validate and enhance the data
      const enhancedData = {
        ...parsedData,
        analyzedAt: new Date(),
        // Ensure all required fields have valid values
        industry_type: parsedData.industry_type || 'Technology',
        pitch_clarity: Math.min(Math.max(parsedData.pitch_clarity || 5, 1), 10),
        investment_score: Math.min(Math.max(parsedData.investment_score || 5, 1), 10),
        market_position: parsedData.market_position || 'Emerging',
        strengths: parsedData.strengths || [],
        weaknesses: parsedData.weaknesses || [],
        expert_opinions: parsedData.expert_opinions || [],
        final_verdict: {
          product_viability: Math.min(Math.max(parsedData.final_verdict?.product_viability || 5, 1), 10),
          market_potential: Math.min(Math.max(parsedData.final_verdict?.market_potential || 5, 1), 10),
          sustainability: Math.min(Math.max(parsedData.final_verdict?.sustainability || 5, 1), 10),
          innovation: Math.min(Math.max(parsedData.final_verdict?.innovation || 5, 1), 10),
          exit_potential: Math.min(Math.max(parsedData.final_verdict?.exit_potential || 5, 1), 10),
          risk_factor: Math.min(Math.max(parsedData.final_verdict?.risk_factor || 5, 1), 10),
          competitive_edge: Math.min(Math.max(parsedData.final_verdict?.competitive_edge || 5, 1), 10)
        }
      };

      console.log('Analysis completed successfully using Mistral');
      return enhancedData;
    } catch (parseError) {
      console.error('Error parsing Mistral response:', parseError);
      throw new Error('Failed to parse analysis response');
    }
  } catch (error) {
    console.error('Error analyzing pitch deck:', error);
    throw error;
  }
}; 