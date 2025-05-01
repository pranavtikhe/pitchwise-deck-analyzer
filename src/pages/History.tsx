import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import InsightsTable from "@/components/InsightsTable";
import { getHistory } from "@/services/historyService";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

const History = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        const data = await getHistory();
        setInsights(data || []);
      } catch (error) {
        console.error("Error loading insights:", error);
        toast.error("Failed to load insights history");
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  const handleViewInsight = (id: string) => {
    navigate(`/insight/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8 px-4">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
          <p className="text-muted-foreground">
            View all your previously analyzed pitch decks
          </p>
        </section>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple" />
            <p className="mt-4 text-muted-foreground">Loading insights...</p>
          </div>
        ) : (
          <InsightsTable 
            insights={insights} 
            onViewInsight={handleViewInsight} 
          />
        )}
      </main>
    </div>
  );
};

export default History;
