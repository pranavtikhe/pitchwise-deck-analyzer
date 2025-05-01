import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import { processPitchDeck } from "@/services/pdfService";
import { saveToHistory } from "@/services/historyService";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { ArrowRight } from "lucide-react";
import AnalysisReport from "@/components/AnalysisReport";
import LoadingScreen from "@/components/LoadingScreen";
import { StarField } from "@/components/StarField";
import Footer from "@/components/Footer";
import styles from "@/styles/upload.module.scss";

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
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false);

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
      // Process the pitch deck (upload PDF and analyze)
      setProgress(5);
      const { pdfUrl, analysis } = await processPitchDeck(file);
      setProgress(40);

      // Save to history
      setProgress(60);
      await saveToHistory(analysis, pdfUrl);
      setProgress(80);

      // Update UI
      setProgress(85);
      setInsights(analysis);
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

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />

      <div
        className={styles.backgroundElements}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <motion.div
          className={styles.starfieldWrapper}
          initial="hidden"
          animate="visible"
        >
          <StarField />
        </motion.div>
        <motion.div
          className={styles.ellipse}
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

      <div className="flex-grow">
        <h1
          className="text-center text-5xl font-bold mb-8"
          style={{
            background:
              "linear-gradient(to right, #FFFFFF 0%, #959595 50%, #FFFFFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: 700,
            fontFamily: "Fustat, sans-serif",
            fontSize: "48px",
            marginTop: "100px",
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

                <div className={styles.disclaimerContainer}>
                  <div className={styles.requiredIndicator}>
                    <span className={styles.asterisk}>*</span>
                    <span className={styles.requiredText}>(required)</span>
                  </div>
                  <div className={styles.disclaimerCheckbox}>
                    <input
                      type="checkbox"
                      id="disclaimer"
                      checked={isDisclaimerAccepted}
                      onChange={(e) => setIsDisclaimerAccepted(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <div className={styles.disclaimerText}>
                      This website is a platform developed and maintained by Neural Paths(Spider). All information, content, tools, and services provided through this platform are intended solely for use by authorized personnel for official and approved purposes.
                      The materials and data provided are offered on an "as is" and "as available" basis. No warranties, either express or implied, are made regarding the accuracy, completeness, reliability, or availability of the content on this platform. Use of the site is at your own risk.
                      Unauthorized access, distribution, modification, or misuse of this website or its data is strictly prohibited and may result in disciplinary action and/or legal proceedings under applicable laws and organizational policies.
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  className={styles.analyzeButton}
                  disabled={!file || isLoading || !isDisclaimerAccepted}
                >
                  Analyze your document now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <LoadingScreen
              text="Analyzing pitch deck..."
              progress={progress}
            />
          )}

          {insights && !isLoading && (
            <div className="mt-8">
              <AnalysisReport data={insights} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
