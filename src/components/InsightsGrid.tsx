import { Lightbulb, Building, AlertTriangle, Puzzle, DollarSign, TrendingUp } from "lucide-react";
import InsightCard from "./InsightCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { GeminiResponse } from "@/services/pdfService";

export type Insights = GeminiResponse;

interface InsightsGridProps {
  insights: Insights;
}

const InsightsGrid = ({ insights }: InsightsGridProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-7xl mx-auto">
      <InsightCard
        title="Innovation"
        content={insights.innovation}
        icon={<Lightbulb className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-insight-innovation`} />}
        type="innovation"
      />
      
      <InsightCard
        title="Industry"
        content={insights.industry}
        icon={<Building className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-insight-industry`} />}
        type="industry"
      />
      
      <InsightCard
        title="Problem"
        content={insights.problem}
        icon={<AlertTriangle className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-insight-problem`} />}
        type="problem"
      />
      
      <InsightCard
        title="Solution"
        content={insights.solution}
        icon={<Puzzle className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-insight-solution`} />}
        type="solution"
      />
      
      <InsightCard
        title="Funding"
        content={insights.funding}
        icon={<DollarSign className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-insight-funding`} />}
        type="funding"
      />
      
      <InsightCard
        title="Market"
        content={insights.market}
        icon={<TrendingUp className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-insight-market`} />}
        type="market"
      />
    </div>
  );
};

export default InsightsGrid;
