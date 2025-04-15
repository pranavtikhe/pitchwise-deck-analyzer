import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface VerdictCardProps {
  title: string;
  score: number;
  description: string;
}

const VerdictCard: React.FC<VerdictCardProps> = ({ title, score, description }) => (
  <Card className="bg-[#2c2c2c] border-gray-800">
    <CardContent className="p-6">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <div className="flex items-center mb-3">
        <div className="text-3xl font-bold text-blue-500">{score}</div>
        <div className="text-gray-400 ml-2">/10</div>
      </div>
      <p className="text-gray-300 text-sm">{description}</p>
    </CardContent>
  </Card>
);

interface FinalVerdictProps {
  insights: {
    ratings: {
      product_viability: number;
      market_potential: number;
      sustainability: number;
      innovation: number;
      exit_potential: number;
      risk_factor: number;
      competitive_edge: number;
    };
    rating_insights: {
      product_viability_insight: string;
      market_potential_insight: string;
      sustainability_insight: string;
      innovation_insight: string;
      exit_potential_insight: string;
      risk_factor_insight: string;
      competitive_edge_insight: string;
    };
  };
}

const FinalVerdict: React.FC<FinalVerdictProps> = ({ insights }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">Final Verdict</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <VerdictCard
          title="Product Viability"
          score={insights.ratings.product_viability}
          description={insights.rating_insights.product_viability_insight}
        />
        <VerdictCard
          title="Market Potential"
          score={insights.ratings.market_potential}
          description={insights.rating_insights.market_potential_insight}
        />
        <VerdictCard
          title="Sustainability"
          score={insights.ratings.sustainability}
          description={insights.rating_insights.sustainability_insight}
        />
        <VerdictCard
          title="Innovation"
          score={insights.ratings.innovation}
          description={insights.rating_insights.innovation_insight}
        />
        <VerdictCard
          title="Exit Potential"
          score={insights.ratings.exit_potential}
          description={insights.rating_insights.exit_potential_insight}
        />
        <VerdictCard
          title="Risk Factor"
          score={insights.ratings.risk_factor}
          description={insights.rating_insights.risk_factor_insight}
        />
        <div className="md:col-start-2">
          <VerdictCard
            title="Competitive Edge"
            score={insights.ratings.competitive_edge}
            description={insights.rating_insights.competitive_edge_insight}
          />
        </div>
      </div>
    </div>
  );
};

export default FinalVerdict; 