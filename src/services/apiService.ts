import { API_CONFIG } from '../config/api';

const getApiConfig = () => {
  const useOpenAI = import.meta.env.VITE_USE_OPENAI === 'true';
  const useGemini = import.meta.env.VITE_USE_GEMINI === 'true';
  
  const config = {
    openai: {
      baseUrl: API_CONFIG.OPENAI_BASE_URL,
      apiKey: API_CONFIG.OPENAI_API_KEY,
      model: API_CONFIG.DEFAULT_MODEL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`
      }
    },
    gemini: {
      baseUrl: API_CONFIG.GEMINI_BASE_URL,
      apiKey: API_CONFIG.GEMINI_API_KEY,
      model: 'gemini-pro',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_CONFIG.GEMINI_API_KEY
      }
    }
  };
  
  console.log('=== API Configuration ===');
  console.log('Using OpenAI:', useOpenAI);
  console.log('Using Gemini:', useGemini);
  console.log('=======================');
  
  return config;
};

export const analyzePitchDeck = async (text: string) => {
  const apiConfig = getApiConfig();
  console.log('\n=== Starting Analysis ===');
  console.log('Text length:', text.length, 'characters');
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
    },
    "expertInsights": {
      "expertOpinions": [
        {
          "name": "string",
          "title": "string",
          "affiliation": "string",
          "analysis": "string",
          "reference": "string",
          "date": "string"
        }
      ],
      "reputationAnalysis": {
        "newsMedia": number,
        "socialMedia": number,
        "investorReviews": number,
        "customerFeedback": number,
        "overall": number
      }
    }
  }`;

  try {
    const results = {
      openai: null,
      gemini: null
    };

    // OpenAI Analysis
    if (import.meta.env.VITE_USE_OPENAI === 'true') {
      console.log('\n=== Sending OpenAI Request ===');
      console.log(`API Endpoint: ${apiConfig.openai.baseUrl}`);
      
      const openaiResponse = await fetch(apiConfig.openai.baseUrl, {
        method: 'POST',
        headers: apiConfig.openai.headers,
        body: JSON.stringify({
          model: apiConfig.openai.model,
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

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        console.error('\n=== OpenAI API Error ===');
        console.error(`Status: ${openaiResponse.status}`);
        console.error(`Error Details:`, errorData);
        console.error('================\n');
      } else {
        const result = await openaiResponse.json();
        results.openai = result.choices[0].message.content;
      }
    }

    // Gemini Analysis
    if (import.meta.env.VITE_USE_GEMINI === 'true') {
      console.log('\n=== Sending Gemini Request ===');
      console.log(`API Endpoint: ${apiConfig.gemini.baseUrl}`);
      
      const geminiResponse = await fetch(apiConfig.gemini.baseUrl, {
        method: 'POST',
        headers: apiConfig.gemini.headers,
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nPlease analyze the following pitch deck:\n\n${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: "application/json"
          }
        })
      });

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        console.error('\n=== Gemini API Error ===');
        console.error(`Status: ${geminiResponse.status}`);
        console.error(`Error Details:`, errorData);
        console.error('================\n');
      } else {
        const result = await geminiResponse.json();
        results.gemini = result.candidates[0].content.parts[0].text;
      }
    }

    // Combine and process results
    let finalAnalysis = null;
    if (results.openai && results.gemini) {
      // If both APIs are used, combine their insights
      const openaiData = JSON.parse(results.openai.replace(/```json\n?|\n?```/g, '').trim());
      const geminiData = JSON.parse(results.gemini.replace(/```json\n?|\n?```/g, '').trim());
      
      // Merge the analyses, giving preference to more detailed responses
      finalAnalysis = {
        ...openaiData,
        expertInsights: {
          ...openaiData.expertInsights,
          expertOpinions: [
            ...openaiData.expertInsights.expertOpinions,
            ...geminiData.expertInsights.expertOpinions
          ],
          reputationAnalysis: {
            newsMedia: Math.max(openaiData.expertInsights.reputationAnalysis.newsMedia, geminiData.expertInsights.reputationAnalysis.newsMedia),
            socialMedia: Math.max(openaiData.expertInsights.reputationAnalysis.socialMedia, geminiData.expertInsights.reputationAnalysis.socialMedia),
            investorReviews: Math.max(openaiData.expertInsights.reputationAnalysis.investorReviews, geminiData.expertInsights.reputationAnalysis.investorReviews),
            customerFeedback: Math.max(openaiData.expertInsights.reputationAnalysis.customerFeedback, geminiData.expertInsights.reputationAnalysis.customerFeedback),
            overall: Math.max(openaiData.expertInsights.reputationAnalysis.overall, geminiData.expertInsights.reputationAnalysis.overall)
          }
        }
      };
    } else if (results.openai) {
      finalAnalysis = JSON.parse(results.openai.replace(/```json\n?|\n?```/g, '').trim());
    } else if (results.gemini) {
      finalAnalysis = JSON.parse(results.gemini.replace(/```json\n?|\n?```/g, '').trim());
    }

    if (!finalAnalysis) {
      throw new Error('No valid analysis results received from either API');
    }

    // Transform the final analysis to match the existing UI structure
    const transformedData = {
      industry_type: finalAnalysis.profile.industry,
      pitch_clarity: 8,
      investment_score: finalAnalysis.expertConclusion.productViability,
      market_position: finalAnalysis.profile.marketPosition,
      market_analysis: {
        market_size: finalAnalysis.profile.marketSize,
        growth_rate: finalAnalysis.marketComparison.metrics.growthRate.startup,
        trends: ["Market trend 1", "Market trend 2"],
        challenges: ["Challenge 1", "Challenge 2"]
      },
      company_overview: {
        company_name: finalAnalysis.profile.companyName,
        industry: finalAnalysis.profile.industry,
        business_model: finalAnalysis.profile.businessModel,
        key_offerings: finalAnalysis.profile.keyOfferings,
        market_position: finalAnalysis.profile.marketPosition,
        founded_on: "N/A"
      },
      strengths: finalAnalysis.strengthsWeaknesses.strengths,
      weaknesses: finalAnalysis.strengthsWeaknesses.weaknesses,
      funding_history: {
        rounds: finalAnalysis.fundingHistory.map(round => ({
          type: round.round,
          amount: round.amount,
          key_investors: round.investors
        }))
      },
      competitor_analysis: {
        competitors: finalAnalysis.competitors.map(competitor => ({
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
            market_share: finalAnalysis.marketComparison.metrics.marketShare.startup,
            growth_rate: finalAnalysis.marketComparison.metrics.growthRate.startup,
            revenue_model: finalAnalysis.marketComparison.metrics.revenueModel.startup,
            differentiator: finalAnalysis.marketComparison.metrics.differentiator.startup
          },
          competitors: finalAnalysis.competitors.map((competitor, index) => ({
            market_share: finalAnalysis.marketComparison.metrics.marketShare[`competitor${index + 1}`],
            growth_rate: finalAnalysis.marketComparison.metrics.growthRate[`competitor${index + 1}`],
            revenue_model: finalAnalysis.marketComparison.metrics.revenueModel[`competitor${index + 1}`],
            differentiator: finalAnalysis.marketComparison.metrics.differentiator[`competitor${index + 1}`]
          }))
        }
      },
      expert_opinions: finalAnalysis.expertOpinions.map(opinion => ({
        name: opinion.name,
        affiliation: opinion.affiliation,
        summary: opinion.summary,
        reference: opinion.reference,
        date: opinion.date
      })),
      expert_insights: {
        expert_opinions: finalAnalysis.expertInsights.expertOpinions.map(opinion => ({
          name: opinion.name,
          title: opinion.title,
          affiliation: opinion.affiliation,
          analysis: opinion.analysis,
          reference: opinion.reference,
          date: opinion.date
        })),
        reputation_analysis: {
          news_media: finalAnalysis.expertInsights.reputationAnalysis.newsMedia,
          social_media: finalAnalysis.expertInsights.reputationAnalysis.socialMedia,
          investor_reviews: finalAnalysis.expertInsights.reputationAnalysis.investorReviews,
          customer_feedback: finalAnalysis.expertInsights.reputationAnalysis.customerFeedback,
          overall: finalAnalysis.expertInsights.reputationAnalysis.overall
        }
      },
      final_verdict: {
        product_viability: finalAnalysis.expertConclusion.productViability,
        market_potential: finalAnalysis.expertConclusion.marketPotential,
        sustainability: finalAnalysis.expertConclusion.sustainability,
        innovation: finalAnalysis.expertConclusion.innovation,
        exit_potential: finalAnalysis.expertConclusion.exitPotential,
        risk_factor: finalAnalysis.expertConclusion.riskFactors,
        competitive_edge: finalAnalysis.expertConclusion.competitiveAdvantage
      },
      proposed_deal_structure: {
        investment_amount: finalAnalysis.dealStructure.investmentAmount,
        valuation_cap: finalAnalysis.dealStructure.valuationCap,
        equity_stake: finalAnalysis.dealStructure.equityStake,
        anti_dilution_protection: finalAnalysis.dealStructure.antiDilution ? "Yes" : "No",
        board_seat: finalAnalysis.dealStructure.boardSeat ? "Yes" : "No",
        liquidation_preference: finalAnalysis.dealStructure.liquidationPreference,
        vesting_schedule: finalAnalysis.dealStructure.vestingSchedule
      },
      key_questions: {
        market_strategy: {
          question: "What is the market strategy?",
          answer: `Based on the analysis, ${finalAnalysis.profile.companyName}'s market strategy focuses on ${finalAnalysis.profile.marketPosition} in the ${finalAnalysis.profile.industry} sector. The company leverages ${finalAnalysis.profile.competitiveAdvantage} to capture market share.`
        },
        user_retention: {
          question: "How is user retention handled?",
          answer: `The company's user retention strategy is built around ${finalAnalysis.profile.keyOfferings.join(', ')}. This approach is supported by ${finalAnalysis.profile.teamHighlights}.`
        },
        regulatory_risks: {
          question: "What are the regulatory risks?",
          answer: `In the ${finalAnalysis.profile.industry} sector, key regulatory considerations include ${finalAnalysis.strengthsWeaknesses.weaknesses.join(', ')}. The company addresses these through ${finalAnalysis.profile.solution}.`
        }
      }
    };

    console.log('\n=== Analysis Complete ===');
    console.log('Analysis Timestamp:', new Date());
    console.log('========================\n');
    
    return transformedData;
  } catch (error) {
    console.error('\n=== Analysis Error ===');
    console.error('Error:', error);
    console.error('====================\n');
    throw error;
  }
}; 