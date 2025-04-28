import { API_CONFIG } from '../config/api';

const getApiConfig = () => {
  const useOpenAI = import.meta.env.VITE_USE_OPENAI === 'true';
  const config = {
    baseUrl: useOpenAI ? API_CONFIG.OPENAI_BASE_URL : API_CONFIG.MISTRAL_BASE_URL,
    apiKey: useOpenAI ? API_CONFIG.OPENAI_API_KEY : API_CONFIG.MISTRAL_API_KEY,
    model: useOpenAI ? API_CONFIG.DEFAULT_MODEL : 'mistral-tiny',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useOpenAI ? API_CONFIG.OPENAI_API_KEY : API_CONFIG.MISTRAL_API_KEY}`
    }
  };
  
  console.log('=== API Configuration ===');
  console.log('Using OpenAI:', useOpenAI);
  console.log('Model:', config.model);
  console.log('Base URL:', config.baseUrl);
  console.log('=======================');
  
  return config;
};

export const analyzePitchDeck = async (text: string) => {
  const apiConfig = getApiConfig();
  console.log('\n=== Starting Analysis ===');
  console.log(`Using ${apiConfig.model} for analysis`);
  console.log(`Text length: ${text.length} characters`);
  console.log('========================\n');

  const systemPrompt = `You are an expert AI system for analyzing pitch decks and providing investment analysis. 
  Analyze the following pitch deck content and provide a detailed, structured analysis.
  Be specific, detailed, and realistic in your analysis.
  If certain information is not available in the pitch deck, make reasonable assumptions based on industry standards and market conditions.
  Format all numerical ratings on a scale of 1-10.
  Ensure all dates are in YYYY-MM-DD format.
  For market positions, use terms like "Leader", "Challenger", "Niche Player", or "Emerging".
  For sentiment analysis, use "Positive", "Negative", or "Neutral".

  IMPORTANT: Provide detailed competitor analysis, market comparison, and expert opinions. 
  For competitors, identify at least 3-4 major players in the market.
  For market comparison, include specific metrics and data points.
  For expert opinions, provide at least 2-3 detailed opinions from industry experts.

  Return the analysis in the following JSON format:
  {
    "profile": {
      "companyName": "string",
      "industry": "string",
      "problemStatement": "string",
      "solution": "string",
      "marketSize": "string",
      "businessModel": "string",
      "competitiveAdvantage": "string",
      "teamHighlights": "string",
      "keyOfferings": ["string"],
      "marketPosition": "string",
      "financials": {
        "revenue": "string",
        "funding": "string",
        "projections": "string"
      }
    },
    "strengthsWeaknesses": {
      "strengths": ["string"],
      "weaknesses": ["string"]
    },
    "competitors": [
      {
        "name": "string",
        "keyInvestors": ["string"],
        "amountRaised": "string",
        "marketPosition": "string",
        "strengths": "string",
        "growthRate": "string",
        "businessModel": "string",
        "keyDifferentiator": "string"
      }
    ],
    "fundingHistory": [
      {
        "round": "string",
        "amount": "string",
        "investors": ["string"],
        "status": "string"
      }
    ],
    "marketComparison": {
      "metrics": {
        "marketShare": {
          "startup": "string",
          "competitor1": "string",
          "competitor2": "string",
          "competitor3": "string"
        },
        "revenueModel": {
          "startup": "string",
          "competitor1": "string",
          "competitor2": "string",
          "competitor3": "string"
        },
        "growthRate": {
          "startup": "string",
          "competitor1": "string",
          "competitor2": "string",
          "competitor3": "string"
        },
        "differentiator": {
          "startup": "string",
          "competitor1": "string",
          "competitor2": "string",
          "competitor3": "string"
        }
      }
    },
    "exitPotential": {
      "likelihood": number,
      "potentialValue": "string"
    },
    "expertOpinions": [
      {
        "name": "string",
        "affiliation": "string",
        "summary": "string",
        "reference": "string",
        "date": "string"
      }
    ],
    "expertConclusion": {
      "productViability": number,
      "marketPotential": number,
      "sustainability": number,
      "innovation": number,
      "exitPotential": number,
      "riskFactors": number,
      "competitiveAdvantage": number
    },
    "dealStructure": {
      "investmentAmount": "string",
      "equityStake": "string",
      "valuationCap": "string",
      "liquidationPreference": "string",
      "antiDilution": boolean,
      "boardSeat": boolean,
      "vestingSchedule": "string"
    }
  }`;

  try {
    console.log('\n=== Sending Request ===');
    console.log(`API Endpoint: ${apiConfig.baseUrl}`);
    
    const response = await fetch(apiConfig.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: apiConfig.model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('\n=== API Error ===');
      console.error(`Status: ${response.status}`);
      console.error(`Error Details:`, errorData);
      console.error('================\n');
      throw new Error(`Analysis failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('\n=== API Response ===');
    console.log('Model:', result.model);
    console.log('Usage:', result.usage);
    console.log('Response Preview:', result.choices[0].message.content.substring(0, 200) + '...');
    console.log('==================\n');

    try {
      const analysisData = JSON.parse(result.choices[0].message.content);
      
      // Transform the OpenAI response format to match the existing UI structure
      const transformedData = {
        industry_type: analysisData.profile.industry,
        pitch_clarity: 8,
        investment_score: analysisData.expertConclusion.productViability,
        market_position: analysisData.profile.marketPosition,
        market_analysis: {
          market_size: analysisData.profile.marketSize,
          growth_rate: analysisData.marketComparison.metrics.growthRate.startup,
          trends: ["Market trend 1", "Market trend 2"],
          challenges: ["Challenge 1", "Challenge 2"]
        },
        company_overview: {
          company_name: analysisData.profile.companyName,
          industry: analysisData.profile.industry,
          business_model: analysisData.profile.businessModel,
          key_offerings: analysisData.profile.keyOfferings,
          market_position: analysisData.profile.marketPosition,
          founded_on: "N/A"
        },
        strengths: analysisData.strengthsWeaknesses.strengths,
        weaknesses: analysisData.strengthsWeaknesses.weaknesses,
        funding_history: {
          rounds: analysisData.fundingHistory.map(round => ({
            type: round.round,
            amount: round.amount,
            key_investors: round.investors
          }))
        },
        competitor_analysis: {
          competitors: analysisData.competitors.map(competitor => ({
            name: competitor.name,
            key_investors: competitor.keyInvestors,
            amount_raised: competitor.amountRaised,
            market_position: competitor.marketPosition,
            strengths: competitor.strengths,
            growth_rate: competitor.growthRate,
            business_model: competitor.businessModel,
            key_differentiator: competitor.keyDifferentiator
          }))
        },
        market_comparison: {
          metrics: {
            startup: {
              market_share: analysisData.marketComparison.metrics.marketShare.startup,
              growth_rate: analysisData.marketComparison.metrics.growthRate.startup,
              revenue_model: analysisData.marketComparison.metrics.revenueModel.startup,
              differentiator: analysisData.marketComparison.metrics.differentiator.startup
            },
            competitors: analysisData.competitors.map((competitor, index) => ({
              market_share: analysisData.marketComparison.metrics.marketShare[`competitor${index + 1}`],
              growth_rate: analysisData.marketComparison.metrics.growthRate[`competitor${index + 1}`],
              revenue_model: analysisData.marketComparison.metrics.revenueModel[`competitor${index + 1}`],
              differentiator: analysisData.marketComparison.metrics.differentiator[`competitor${index + 1}`]
            }))
          }
        },
        expert_opinions: analysisData.expertOpinions.map(opinion => ({
          name: opinion.name,
          affiliation: opinion.affiliation,
          summary: opinion.summary,
          reference: opinion.reference,
          date: opinion.date
        })),
        final_verdict: {
          product_viability: analysisData.expertConclusion.productViability,
          market_potential: analysisData.expertConclusion.marketPotential,
          sustainability: analysisData.expertConclusion.sustainability,
          innovation: analysisData.expertConclusion.innovation,
          exit_potential: analysisData.expertConclusion.exitPotential,
          risk_factor: analysisData.expertConclusion.riskFactors,
          competitive_edge: analysisData.expertConclusion.competitiveAdvantage
        },
        proposed_deal_structure: {
          investment_amount: analysisData.dealStructure.investmentAmount,
          valuation_cap: analysisData.dealStructure.valuationCap,
          equity_stake: analysisData.dealStructure.equityStake,
          anti_dilution_protection: analysisData.dealStructure.antiDilution ? "Yes" : "No",
          board_seat: analysisData.dealStructure.boardSeat ? "Yes" : "No",
          liquidation_preference: analysisData.dealStructure.liquidationPreference,
          vesting_schedule: analysisData.dealStructure.vestingSchedule
        },
        key_questions: {
          market_strategy: {
            question: "What is the market strategy?",
            answer: analysisData.profile.marketStrategy || "N/A"
          },
          user_retention: {
            question: "How is user retention handled?",
            answer: analysisData.profile.userRetention || "N/A"
          },
          regulatory_risks: {
            question: "What are the regulatory risks?",
            answer: analysisData.profile.regulatoryRisks || "N/A"
          },
          product_development: {
            question: "What is the product development roadmap?",
            answer: analysisData.profile.productDevelopment || "N/A"
          },
          market_expansion: {
            question: "What are the market expansion plans?",
            answer: analysisData.profile.marketExpansion || "N/A"
          }
        }
      };

      console.log('\n=== Analysis Complete ===');
      console.log(`Successfully analyzed using ${apiConfig.model}`);
      console.log('Analysis Timestamp:', new Date());
      console.log('========================\n');
      
      return transformedData;
    } catch (parseError) {
      console.error('\n=== Parse Error ===');
      console.error('Error:', parseError);
      console.error('==================\n');
      throw new Error('Failed to parse analysis response');
    }
  } catch (error) {
    console.error('\n=== Analysis Error ===');
    console.error('Error:', error);
    console.error('====================\n');
    throw error;
  }
}; 