import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getAnalysisReport } from "@/services/storageService";
import { MistralResponse } from "@/services/pdfService";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

const Insight = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<MistralResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsight = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("No insight ID provided");
        }
        const data = await getAnalysisReport(`analysis-${id}`);
        setInsight(data.insights);
      } catch (error) {
        console.error("Error loading insight:", error);
        toast.error("Failed to load insight details");
        navigate("/history");
      } finally {
        setLoading(false);
      }
    };

    loadInsight();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple" />
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No insight data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8 px-4">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analysis Details</h1>
          <p className="text-muted-foreground">
            Detailed analysis of the pitch deck
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Industry Type</h3>
                <p className="text-muted-foreground">{insight.industry_type}</p>
              </div>
              <div>
                <h3 className="font-medium">Market Position</h3>
                <p className="text-muted-foreground">{insight.market_position}</p>
              </div>
              <div>
                <h3 className="font-medium">Investment Score</h3>
                <p className="text-muted-foreground">{insight.investment_score}/10</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Market Size</h3>
                <p className="text-muted-foreground">{insight.market_analysis.market_size}</p>
              </div>
              <div>
                <h3 className="font-medium">Growth Rate</h3>
                <p className="text-muted-foreground">{insight.market_analysis.growth_rate}</p>
              </div>
              <div>
                <h3 className="font-medium">Key Trends</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {insight.market_analysis.trends.map((trend, index) => (
                    <li key={index}>{trend}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Strengths</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              {insight.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Weaknesses</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              {insight.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Insight; 