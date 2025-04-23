import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import { extractTextFromPdf, analyzeWithBackend } from "@/services/pdfService";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { ArrowRight } from "lucide-react";
import AnalysisReport from "@/components/AnalysisReport";
import LoadingScreen from "@/components/LoadingScreen";
import { StarField } from "@/components/StarField";
import styles from "@/styles/upload.module.scss";
import landingStyles from "@/pages/landing/styles/LandingPage.module.scss";

const starfieldVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1 } },
};

const ellipseVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 1 } },
};

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [progress, setProgress] = useState(0);

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
    setProgress(0);

    try {
      // Document Processing (0-20%)
      setProgress(5);
      const extractedText = await extractTextFromPdf(file);
      setProgress(20);

      // Startup Profile (20-40%)
      setProgress(25);
      const analysisResults = await analyzeWithBackend(extractedText);
      setProgress(40);

      // Market Analysis (40-60%)
      setProgress(45);
      // Wait for market analysis to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(60);

      // Sentiment Analysis (60-80%)
      setProgress(65);
      // Wait for sentiment analysis to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(80);

      // Report Generation (80-100%)
      setProgress(85);
      setInsights(analysisResults);
      setProgress(100);

      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      // Keep the progress at 100% briefly before resetting
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 1000);
    }
  };

  const steps = [
    "Document Processing",
    "Startup Profile",
    "Market Analysis",
    "Sentiment Analysis",
    "Report Generation",
  ];

  // Start loading and progress simulation
  const startProcessing = () => {
    setIsLoading(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
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

  const starfieldVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const ellipseVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <Navbar />

      <div className={landingStyles.backgroundElements}>
        <motion.div
          className={landingStyles.starfieldWrapper}
          variants={starfieldVariants}
          initial="hidden"
          animate="visible"
        >
          <StarField />
        </motion.div>
        <motion.div
          className={landingStyles.ellipse}
          variants={ellipseVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src="/images/white-radial.svg"
            alt="Radial gradient"
            width={1000}
            height={1000}
          />
        </motion.div>
      </div>

      <h1
        className="text-center text-5xl font-bold mb-8"
        style={{
          background:
            "linear-gradient(to right, #FFFFFF 0%, #959595 50%, #FFFFFF 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontWeight: 700,
          fontFamily: "fustat",
          fontSize: "48px",
        }}
      >
        {isLoading
          ? "Analyzing"
          : insights && !isLoading
          ? "Analysis Report"
          : "Start Analysis"}
      </h1>

      <div className={styles.uploadContainer}>
        {!insights && !isLoading && (
          <div className={styles.gradientWrapper}>
            <img
              src="/images/backgroundgradiant.png"
              alt="Gradient Background"
              className={styles.gradientBackground}
            />
            <div className={styles.innerBox}>
              <h2 className="text-xl font-medium text-white mb-2">
                Upload Your Pitch Deck
              </h2>

              <div
                className={styles.uploadArea}
                onClick={handleUploadClick}
                role="button"
                tabIndex={0}
              >
                <FileUpload
                  ref={fileInputRef}
                  onFileSelected={handleFileSelected}
                  isLoading={isLoading}
                />
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

        {isLoading && <LoadingScreen progress={progress} />}

        {insights && !isLoading && (
          <div className="mt-8">
            <AnalysisReport data={insights} />
          </div>
        )}
      </div>

      <footer className="py-6 border-t border-gray-800">
        <div className="container text-center text-sm text-gray-500">
          <p>© 2025 PitchDeck Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Index;
