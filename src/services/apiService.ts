import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzePitchDeck = async (text: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
    Analyze this pitch deck and provide a comprehensive analysis in the following JSON format. 
    For each section, if information is not explicitly mentioned, make educated inferences based on:
    1. The company's industry and stage
    2. Standard market practices
    3. Comparable companies in the same sector
    4. The company's current funding status
    5. The overall business model and market position

    Pay special attention to the proposed deal structure. Even if not explicitly mentioned, infer reasonable terms based on:
    - Typical valuation multiples for the industry
    - Standard investment terms for the company's stage
    - Market trends in similar deals
    - The company's growth potential and risk profile

    Return ONLY the JSON object without any markdown formatting or additional text.
    
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
        "investment_amount": "string (e.g., '$2M', 'Not specified' is not acceptable. Provide a reasonable range based on company stage and industry)",
        "valuation_cap": "string (e.g., '$10M', 'Not specified' is not acceptable. Provide a reasonable estimate based on metrics)",
        "equity_stake": "string (e.g., '15-20%', 'Not specified' is not acceptable. Provide a reasonable range)",
        "anti_dilution_protection": "string (e.g., 'Full ratchet', 'Weighted average', 'Not specified' is not acceptable. Provide standard terms)",
        "board_seat": "string (e.g., '1 board seat', 'Observer rights', 'Not specified' is not acceptable. Provide standard terms)",
        "liquidation_preference": "string (e.g., '1x', '2x', 'Not specified' is not acceptable. Provide standard terms)",
        "vesting_schedule": "string (e.g., '4 years with 1-year cliff', 'Not specified' is not acceptable. Provide standard terms)",
        "other_terms": "string (e.g., 'Information rights', 'ROFR', 'Not specified' is not acceptable. Provide standard terms)"
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
      }
    }

    Pitch Deck Text:
    ${text}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean the response text
    responseText = responseText.replace(/```json\s*/g, '');
    responseText = responseText.replace(/```\s*$/g, '');
    responseText = responseText.trim();
    
    // Try to parse the JSON response
    try {
      const parsedResponse = JSON.parse(responseText);
      
      // Ensure proposed_deal_structure has meaningful values
      const dealStructure = parsedResponse.proposed_deal_structure;
      if (dealStructure) {
        // Set default values based on company stage if not provided
        const defaultDealStructure = {
          investment_amount: "Based on company stage and industry standards",
          valuation_cap: "Based on comparable companies and metrics",
          equity_stake: "Standard range for company stage",
          anti_dilution_protection: "Standard market terms",
          board_seat: "Standard investor rights",
          liquidation_preference: "Standard market terms",
          vesting_schedule: "Standard vesting terms",
          other_terms: "Standard investor protections"
        };

        // Replace any "Not specified" values with meaningful defaults
        Object.keys(dealStructure).forEach(key => {
          if (dealStructure[key] === "Not specified" || !dealStructure[key]) {
            dealStructure[key] = defaultDealStructure[key];
          }
        });
      }
      
      return parsedResponse;
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.log('Raw response:', responseText);
      
      // If JSON parsing fails, try to extract fields using improved regex patterns
      const extractField = (fieldName: string, defaultValue: string = "Based on analysis"): string => {
        const regex = new RegExp(`"${fieldName}"\\s*:\\s*"([^"]*)"`, 'i');
        const match = responseText.match(regex);
        return match ? match[1] : defaultValue;
      };

      const extractNumber = (fieldName: string, defaultValue: number = 0): number => {
        const regex = new RegExp(`"${fieldName}"\\s*:\\s*(\\d+)`, 'i');
        const match = responseText.match(regex);
        return match ? parseInt(match[1], 10) : defaultValue;
      };

      const extractArray = (fieldName: string): string[] => {
        const regex = new RegExp(`"${fieldName}"\\s*:\\s*\\[([^\\]]*)\\]`, 'i');
        const match = responseText.match(regex);
        if (!match) return [];
        
        try {
          return JSON.parse(`[${match[1]}]`);
        } catch {
          return match[1].split(',').map(s => s.trim().replace(/"/g, ''));
        }
      };

      const extractedData = {
        industry_type: extractField('industry_type'),
        pitch_clarity: extractNumber('pitch_clarity'),
        investment_score: extractNumber('investment_score'),
        market_position: extractField('market_position'),
        company_overview: {
          company_name: extractField('company_name'),
          industry: extractField('industry'),
          business_model: extractField('business_model'),
          key_offerings: extractField('key_offerings'),
          market_position: extractField('market_position'),
          founded_on: extractField('founded_on')
        },
        strengths: extractArray('strengths'),
        weaknesses: extractArray('weaknesses'),
        funding_history: {
          rounds: JSON.parse(responseText.match(/rounds":\s*(\[[^\]]+\])/)?.[1] || '[]').map(round => ({
            ...round,
            key_investors: Array.isArray(round.key_investors) ? round.key_investors : []
          }))
        },
        proposed_deal_structure: {
          investment_amount: extractField('investment_amount', "Based on company stage and industry standards"),
          valuation_cap: extractField('valuation_cap', "Based on comparable companies and metrics"),
          equity_stake: extractField('equity_stake', "Standard range for company stage"),
          anti_dilution_protection: extractField('anti_dilution_protection', "Standard market terms"),
          board_seat: extractField('board_seat', "Standard investor rights"),
          liquidation_preference: extractField('liquidation_preference', "Standard market terms"),
          vesting_schedule: extractField('vesting_schedule', "Standard vesting terms"),
          other_terms: extractField('other_terms', "Standard investor protections")
        },
        key_questions: {
          market_strategy: extractArray('market_strategy'),
          user_relation: extractArray('user_relation'),
          regulatory_compliance: extractArray('regulatory_compliance')
        },
        final_verdict: {
          product_viability: extractNumber('product_viability'),
          market_potential: extractNumber('market_potential'),
          sustainability: extractNumber('sustainability'),
          innovation: extractNumber('innovation'),
          exit_potential: extractNumber('exit_potential'),
          risk_factor: extractNumber('risk_factor'),
          competitive_edge: extractNumber('competitive_edge')
        }
      };
      return extractedData;
    }
  } catch (error) {
    console.error('Error analyzing pitch deck:', error);
    throw error;
  }
}; 