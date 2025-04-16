import { useState, useRef } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import { extractTextFromPdf, analyzeWithBackend } from "@/services/pdfService";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { ArrowRight } from "lucide-react";
import AnalysisReport from "@/components/AnalysisReport";
import LoadingScreen from "@/components/LoadingScreen";
import styles from "@/styles/upload.module.scss";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    setIsLoading(true);
    setInsights(null);

    try {
      const extractedText = await extractTextFromPdf(file);
      const analysisResults = await analyzeWithBackend(extractedText);
      setInsights(analysisResults);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    'Document Processing',
    'Startup Profile',
    'Market Analysis',
    'Sentiment Analysis',
    'Report Generation'
  ];

  // Start loading and progress simulation
  const startProcessing = () => {
    setIsLoading(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsLoading(false); // hide loader when done
          return prev;
        }
      });
    }, 2000); // Adjust timing as needed
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex flex-col">
      <img src="/images/slogo.svg" alt="logo" className="w-[68px] h-[72px] mx-auto" />


      <main className="flex-1 container py-16">
        <h1 className={styles.title}>Start Analysis</h1>

        <div className={styles.uploadContainer}>
          {!insights && !isLoading && (
            <div className={styles.gradientWrapper}>
              <img
                src="/images/backgroundgradiant.png"
                alt="Gradient Background"
                className={styles.gradientBackground}
              />
              <div className={styles.innerBox}>
                <h2 className="text-xl font-medium text-white mb-2">Upload Your Pitch Deck</h2>

                <div className={styles.uploadArea} onClick={handleUploadClick} role="button" tabIndex={0}>
                  <FileUpload ref={fileInputRef} onFileSelected={handleFileSelected} isLoading={isLoading} />
                </div>

                <button
                  onClick={handleAnalyze}
                  className={styles.analyzeButton}
                  disabled={!file || isLoading}
                >
                  Analyze your document now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {isLoading && <LoadingScreen currentStep={currentStep} />}

          {insights && !isLoading && (
            <div className="mt-8">
              <AnalysisReport insights={insights} analyzedAt={new Date()} />
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 border-t border-gray-800">
        <div className="container text-center text-sm text-gray-500">
          <p>© 2025 PitchDeck Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
