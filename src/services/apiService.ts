import { API_CONFIG } from '../config/api';

export const analyzePitchDeck = async (text: string) => {
  console.log('Starting pitch deck analysis with Mistral AI...');
  console.log(`Total characters to analyze: ${text.length}`);

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
      }
    }

    Pitch Deck Text: ${text}`;

  try {
    console.log('Sending request to Mistral AI API...');
    console.log(`Using model: ${API_CONFIG.MODEL}`);
    
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert pitch deck analyzer. Provide detailed analysis in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    console.log('Received response from Mistral AI API');
    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      console.error('Mistral AI API request failed:', response.status, response.statusText);
      throw new Error(`Analysis failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log('Successfully parsed Mistral AI response');
    console.log(`Response model: ${result.model}`);
    console.log(`Total tokens used: ${result.usage?.total_tokens || 'N/A'}`);

    const analysisText = result.choices[0].message.content;
    console.log(`Received analysis text length: ${analysisText.length} characters`);

    try {
      // Clean the response text and parse JSON
      let cleanJsonText = analysisText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      const parsedData = JSON.parse(cleanJsonText);
      console.log('Successfully parsed analysis JSON');
      console.log('Analysis completed successfully using Mistral AI');
      return parsedData;
    } catch (parseError) {
      console.error('Error parsing Mistral response:', parseError);
      
      // Attempt to extract and fix JSON if parsing fails
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedJson = jsonMatch[0];
          const fixedJson = extractedJson
            .replace(/,(\s*[}\]])/g, '$1')
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            .replace(/'([^']*)'/g, '"$1"');
          const parsedData = JSON.parse(fixedJson);
          console.log('Successfully extracted and fixed JSON');
          return parsedData;
        }
      } catch (extractError) {
        console.error('Failed to extract JSON:', extractError);
      }
      
      throw new Error('Failed to parse analysis response');
    }
  } catch (error) {
    console.error('Error analyzing pitch deck:', error);
    throw error;
  }
}; 