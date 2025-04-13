
import { useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import InsightsGrid, { Insights } from "@/components/InsightsGrid";
import { extractTextFromPdf, analyzeWithBackend } from "@/services/pdfService";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Lightbulb, RefreshCw } from "lucide-react";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<Insights | null>(null);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            AI-Powered Pitch Deck Analysis
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your pitch deck and get instant insights on innovation, industry fit, 
            problem statement, solution viability, funding needs, and market potential.
          </p>
        </section>
        
        <section className="mb-12">
          <FileUpload onFileSelected={handleFileSelected} isLoading={isLoading} />
        </section>

        {insights && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple" />
                Analysis Results
              </h3>
              
              <Button variant="outline" onClick={handleReanalyze} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Reanalyze
              </Button>
            </div>
            
            <InsightsGrid insights={insights} />
          </section>
        )}
        
        <section className="py-12 bg-muted/40 rounded-lg px-6" id="about">
          <h3 className="text-2xl font-semibold mb-4 text-center">How It Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-purple/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple">1</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Upload</h4>
              <p className="text-sm text-muted-foreground">
                Upload your pitch deck in PDF format. Your file remains private and secure.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple">2</span>
              </div>
              <h4 className="text-lg font-medium mb-2">AI Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Our secure backend powered by Google Gemini extracts and analyzes key business insights.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple">3</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Get Insights</h4>
              <p className="text-sm text-muted-foreground">
                Review structured insights on innovation, market fit, problem, solution, funding, and more.
              </p>
            </div>
          </div>
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
