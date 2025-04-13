
import { Lightbulb, Building, AlertTriangle, PuzzlePiece, DollarSign, TrendingUp } from "lucide-react";
import InsightCard from "./InsightCard";

export interface Insights {
  innovation: string;
  industry: string;
  problem: string;
  solution: string;
  funding: string;
  market: string;
}

interface InsightsGridProps {
  insights: Insights;
}

const InsightsGrid = ({ insights }: InsightsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
      <InsightCard
        title="Innovation"
        content={insights.innovation}
        icon={<Lightbulb className="h-5 w-5 text-insight-innovation" />}
        type="innovation"
      />
      
      <InsightCard
        title="Industry"
        content={insights.industry}
        icon={<Building className="h-5 w-5 text-insight-industry" />}
        type="industry"
      />
      
      <InsightCard
        title="Problem"
        content={insights.problem}
        icon={<AlertTriangle className="h-5 w-5 text-insight-problem" />}
        type="problem"
      />
      
      <InsightCard
        title="Solution"
        content={insights.solution}
        icon={<PuzzlePiece className="h-5 w-5 text-insight-solution" />}
        type="solution"
      />
      
      <InsightCard
        title="Funding"
        content={insights.funding}
        icon={<DollarSign className="h-5 w-5 text-insight-funding" />}
        type="funding"
      />
      
      <InsightCard
        title="Market"
        content={insights.market}
        icon={<TrendingUp className="h-5 w-5 text-insight-market" />}
        type="market"
      />
    </div>
  );
};

export default InsightsGrid;
