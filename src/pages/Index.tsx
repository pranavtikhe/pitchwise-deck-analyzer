import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import InsightsGrid, { Insights } from "@/components/InsightsGrid";
import ComprehensiveAnalysis from "@/components/ComprehensiveAnalysis";
import OverallRatingCard from "@/components/OverallRatingCard";
import RatingRadarChart from "@/components/RatingRadarChart";
import { extractTextFromPdf, analyzeWithBackend, saveInsightsToSupabase } from "@/services/pdfService";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Lightbulb, RefreshCw, History, Save, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showComprehensiveAnalysis, setShowComprehensiveAnalysis] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const navigate = useNavigate();

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    setShowUpload(false); // Hide the upload component after file is selected
    processFile(selectedFile);
  };

  const processFile = async (pdfFile: File) => {
    setIsLoading(true);
    setInsights(null);

    try {
      // Extract text from PDF
      const extractedText = await extractTextFromPdf(pdfFile);
      
      // Analyze the text with the backend service
      const analysisResults = await analyzeWithBackend(extractedText);
      
      // Set the insights
      setInsights(analysisResults);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReanalyze = () => {
    if (file) {
      processFile(file);
    }
  };

  const handleAnalyzeAnother = () => {
    setFile(null);
    setInsights(null);
    setCompanyName("");
    setShowUpload(true);
  };

  const handleSaveInsights = async () => {
    if (!insights || !file) {
      toast.error("No analysis to save");
      return;
    }
    
    if (!companyName.trim()) {
      toast.error("Please enter a company name");
      return;
    }
    
    try {
      setIsSaving(true);
      await saveInsightsToSupabase(insights, file.name, companyName);
      toast.success("Analysis saved successfully");
    } catch (error) {
      console.error("Error saving insights:", error);
      toast.error("Failed to save analysis");
    } finally {
      setIsSaving(false);
    }
  };

  const goToHistory = () => {
    navigate("/history");
  };

  const toggleComprehensiveAnalysis = () => {
    setShowComprehensiveAnalysis(!showComprehensiveAnalysis);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
            <h1 className="text-3xl font-bold">Pitch Deck Analyzer</h1>
            {!showUpload && (
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground mb-1">Analyze another pitch deck</span>
                <Button 
                  variant="default" 
                  onClick={handleAnalyzeAnother}
                  className="flex items-center px-6 py-2 text-lg"
                  size="lg"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload
                </Button>
              </div>
            )}
          </div>
          <p className="text-muted-foreground mb-6">
            Upload a pitch deck PDF to get AI-powered insights and analysis
          </p>
          
          {showUpload && (
            <FileUpload onFileSelected={handleFileSelected} isLoading={isLoading} />
          )}
          
          {isLoading && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
              <p className="mt-2 text-muted-foreground">Analyzing your pitch deck...</p>
            </div>
          )}
        </section>

        {insights && (
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple" />
                Analysis Results
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:flex-initial">
                  <Input 
                    placeholder="Enter company name to save"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleReanalyze} 
                    disabled={isLoading}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Reanalyze
                  </Button>
                  
                  <Button 
                    onClick={handleSaveInsights} 
                    disabled={isSaving || !companyName.trim()}
                  >
                    <Save className={`mr-2 h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
                    {isSaving ? "Saving..." : "Save Analysis"}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Rating Radar Chart - Always visible */}
            {/* <div className="mb-8">
              <RatingRadarChart insights={insights} />
            </div> */}
            
            {/* Overall Rating Card - Always visible */}
            <div className="mb-8">
              <OverallRatingCard insights={insights} />
            </div>
            
            <InsightsGrid insights={insights} />
            
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
                <ComprehensiveAnalysis insights={insights} />
              </div>
            )}
          </section>
        )}
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-purple" />
              Previous Analyses
            </h2>
            <Button onClick={goToHistory}>
              View All
            </Button>
          </div>
          
          {/* You can add a preview of recent analyses here */}
        </section>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 PitchDeck Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
