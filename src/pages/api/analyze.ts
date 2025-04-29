import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Analyze the following pitch deck text and extract key information in a structured format. 
    Focus on these aspects:
    1. Company Name: What is the name of the company?
    2. Industry: Which industry or sector does this belong to?
    3. Business Model: How does the company make money?
    4. Key Offerings: What are the main products or services?
    5. Market: What is the market size and opportunity?
    6. Founded On: When was the company founded?
    7. Strengths: What are the key strengths of this business?
    8. Weaknesses: What are the potential weaknesses or risks?
    9. Funding: What are the funding requirements or financial aspects?
    10. Key Investors: Who are the main investors?
    11. Valuation Cap: What is the valuation cap?
    12. Equity Stake: What is the equity stake being offered?
    13. Anti-Dilution Protection: What are the anti-dilution terms?
    14. Board Seat: Are there any board seat arrangements?
    15. Liquidation Preference: What are the liquidation preferences?
    16. Vesting Schedule: What is the vesting schedule?
    17. Other Terms: Any other important terms?
    18. Market Strategy Questions: What questions should be asked about market strategy?
    19. User Relation Questions: What questions should be asked about user relations?
    20. Regulatory Compliance Questions: What questions should be asked about regulatory compliance?

    Additionally, provide ratings (on a scale of 1-10) for:
    - Innovation Rating: How innovative is the solution?
    - Market Potential Rating: How large is the market opportunity?
    - Competitive Advantage Rating: How strong is the competitive position?
    - Financial Strength Rating: How strong is the financial position?
    - Team Rating: How strong is the team?
    - Overall Rating: Overall assessment of the pitch

    The text includes both regular PDF text and OCR-extracted text from images. Please analyze ALL content thoroughly.
    
    Here's the pitch deck text:
    ${text}

    Please provide the analysis in a JSON format with these exact keys: company_name, industry, business_model, key_offerings, market, founded_on, strengths, weaknesses, funding, key_investors, valuation_cap, equity_stake, anti_dilution, board_seat, liquidation_preference, vesting_schedule, other_terms, market_strategy_questions, user_relation_questions, regulatory_compliance_questions, and ratings (which should be an object with the rating keys).
    Return ONLY the JSON object without any markdown formatting or code blocks.
    Ensure the JSON is properly formatted with no trailing commas or syntax errors.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    // Clean the response text to handle markdown formatting
    let cleanJsonText = analysisText;
    cleanJsonText = cleanJsonText.replace(/```json\s*/g, '');
    cleanJsonText = cleanJsonText.replace(/```\s*$/g, '');

    try {
      const parsedResponse = JSON.parse(cleanJsonText);
      return res.status(200).json(parsedResponse);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response:', analysisText);
      
      // If JSON parsing fails, try to extract information using regex
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedJson = jsonMatch[0];
          
          // Try to fix common JSON syntax errors
          let fixedJson = extractedJson
            .replace(/,(\s*[}\]])/g, '$1')
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            .replace(/'([^']*)'/g, '"$1"');
          
          try {
            const parsedResponse = JSON.parse(fixedJson);
            return res.status(200).json(parsedResponse);
          } catch (fixedJsonError) {
            console.error('Error parsing fixed JSON:', fixedJsonError);
            
            // If all parsing attempts fail, try to extract individual fields using regex
            const extractField = (fieldName: string): string => {
              const regex = new RegExp(`"${fieldName}"\\s*:\\s*"([^"]*)"`, 'i');
              const match = analysisText.match(regex);
              return match ? match[1] : "Not Specified";
            };
            
            const extractRating = (ratingName: string): number => {
              const regex = new RegExp(`"${ratingName}"\\s*:\\s*(\\d+)`, 'i');
              const match = analysisText.match(regex);
              return match ? parseInt(match[1], 10) : 5;
            };
            
            const structuredResponse = {
              company_name: extractField('company_name'),
              industry: extractField('industry'),
              business_model: extractField('business_model'),
              key_offerings: extractField('key_offerings'),
              market: extractField('market'),
              founded_on: extractField('founded_on'),
              strengths: extractField('strengths'),
              weaknesses: extractField('weaknesses'),
              funding: extractField('funding'),
              key_investors: extractField('key_investors'),
              valuation_cap: extractField('valuation_cap'),
              equity_stake: extractField('equity_stake'),
              anti_dilution: extractField('anti_dilution'),
              board_seat: extractField('board_seat'),
              liquidation_preference: extractField('liquidation_preference'),
              vesting_schedule: extractField('vesting_schedule'),
              other_terms: extractField('other_terms'),
              market_strategy_questions: extractField('market_strategy_questions'),
              user_relation_questions: extractField('user_relation_questions'),
              regulatory_compliance_questions: extractField('regulatory_compliance_questions'),
              ratings: {
                innovation_rating: extractRating('innovation_rating'),
                market_potential_rating: extractRating('market_potential_rating'),
                competitive_advantage_rating: extractRating('competitive_advantage_rating'),
                financial_strength_rating: extractRating('financial_strength_rating'),
                team_rating: extractRating('team_rating'),
                overall_rating: extractRating('overall_rating')
              }
            };
            
            return res.status(200).json(structuredResponse);
          }
        }
      } catch (extractionError) {
        console.error('Error extracting JSON from response:', extractionError);
      }
      
      return res.status(500).json({ error: 'Failed to parse the analysis response' });
    }
  } catch (error) {
    console.error('Error analyzing pitch deck:', error);
    return res.status(500).json({ error: 'Failed to analyze the pitch deck' });
  }
} 