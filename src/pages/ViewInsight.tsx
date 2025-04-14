import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import InsightsGrid, { Insights } from "@/components/InsightsGrid";
import ComprehensiveAnalysis from "@/components/ComprehensiveAnalysis";
import OverallRatingCard from "@/components/OverallRatingCard";
import RatingRadarChart from "@/components/RatingRadarChart";
import { fetchInsightById } from "@/services/pdfService";

const ViewInsight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showComprehensiveAnalysis, setShowComprehensiveAnalysis] = useState(false);

  useEffect(() => {
    const loadInsight = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchInsightById(id);
        if (!data) {
          toast.error("Insight not found");
          navigate("/history");
          return;
        }
        setInsight(data);
      } catch (error) {
        console.error("Error loading insight:", error);
        toast.error("Failed to load insight");
      } finally {
        setLoading(false);
      }
    };

    loadInsight();
  }, [id, navigate]);

  const toggleComprehensiveAnalysis = () => {
    setShowComprehensiveAnalysis(!showComprehensiveAnalysis);
  };

  // Convert insight data to Insights type
  const getInsightsFromData = (data: any): Insights => {
    return {
      innovation: data.innovation || "Not available",
      industry: data.industry || "Not available",
      problem: data.problem || "Not available",
      solution: data.solution || "Not available",
      funding: data.funding || "Not available",
      market: data.market || "Not available",
      strengths: data.strengths || "Not available",
      weaknesses: data.weaknesses || "Not available",
      competitors: data.competitors || "Not available",
      funding_history: data.funding_history || "Not available",
      expert_opinions: data.expert_opinions || "Not available",
      key_questions: data.key_questions || "Not available",
      suggested_improvements: data.suggested_improvements || "Not available",
      key_insights: data.key_insights || "Not available",
      market_comparison: data.market_comparison || "Not available",
      exit_potential: data.exit_potential || "Not available",
      overall_reputation: data.overall_reputation || "Not available",
      ratings: {
        innovation_rating: data.innovation_rating || 5,
        market_potential_rating: data.market_potential_rating || 5,
        competitive_advantage_rating: data.competitive_advantage_rating || 5,
        financial_strength_rating: data.financial_strength_rating || 5,
        team_rating: data.team_rating || 5,
        overall_rating: data.overall_rating || 5
      }
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple" />
            <p className="mt-4 text-muted-foreground">Loading insight...</p>
          </div>
        ) : insight ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{insight.company_name}</h1>
              <p className="text-muted-foreground">
                Analysis from {new Date(insight.created_at).toLocaleDateString()}
              </p>
              {insight.file_name && (
                <p className="text-sm text-muted-foreground">
                  File: {insight.file_name}
                </p>
              )}
            </div>
            
            {/* Rating Radar Chart - Always visible */}
            {/* <div className="mb-8">
              <RatingRadarChart insights={getInsightsFromData(insight)} />
            </div> */}
            
            {/* Overall Rating Card - Always visible */}
            <div className="mb-8">
              <OverallRatingCard insights={getInsightsFromData(insight)} />
            </div>
            
            <InsightsGrid insights={getInsightsFromData(insight)} />
            
            {/* Comprehensive Analysis Toggle */}
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                onClick={toggleComprehensiveAnalysis}
                className="flex items-center mx-auto"
              >
                {showComprehensiveAnalysis ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Hide Comprehensive Analysis
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show Comprehensive Analysis
                  </>
                )}
              </Button>
            </div>
            
            {/* Comprehensive Analysis */}
            {showComprehensiveAnalysis && (
              <div className="mt-6">
                <ComprehensiveAnalysis insights={getInsightsFromData(insight)} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Insight not found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewInsight;
