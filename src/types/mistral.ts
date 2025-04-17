export interface MistralResponse {
  industry_type: string;
  pitch_clarity: number;
  investment_score: number;
  market_position: string;
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
  proposed_deal_structure: {
    investment_amount: string;
    valuation_cap: string;
    equity_stake: string;
    anti_dilution_protection: string;
    board_seat: string;
    liquidation_preference: string;
    vesting_schedule: string;
    other_terms: string;
  };
  key_questions: {
    market_strategy: string[];
    user_relation: string[];
    regulatory_compliance: string[];
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
} 