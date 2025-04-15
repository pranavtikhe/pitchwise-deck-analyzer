import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import AnalysisReport from "@/components/AnalysisReport";
import { fetchInsightById } from "@/services/pdfService";

const ViewInsight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          <AnalysisReport insights={insight} />
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
