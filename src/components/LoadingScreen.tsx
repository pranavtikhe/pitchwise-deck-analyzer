// components/LoadingScreen.tsx
import React, { useEffect, useState } from 'react';
import styles from '@/styles/upload.module.scss';

const steps = [
  { title: 'Document Processing', description: 'Extracting text and data from pitch deck.' },
  { title: 'Startup Profile', description: 'Analyzing company information and business model.' },
  { title: 'Market Analysis', description: 'Evaluating market position and competition.' },
  { title: 'Sentiment Analysis', description: 'Assessing pitch clarity and investor impact.' },
  { title: 'Report Generation', description: 'Creating comprehensive investment analysis.' }
];

interface LoadingScreenProps {
  progress?: number;
  text?: string;
}

const LoadingScreen = ({ progress = 0, text = 'Generating' }: LoadingScreenProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Smoothly animate to the target progress
    const animationDuration = 500; // 500ms for smooth animation
    const startTime = Date.now();
    const startProgress = animatedProgress;
    const targetProgress = progress;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Ease out cubic function for smooth animation
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentProgress = startProgress + (targetProgress - startProgress) * easeOut(progress);

      setAnimatedProgress(currentProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [progress]);

  // Calculate which step is active based on animated progress
  const currentStep = Math.min(Math.floor(animatedProgress / 20), steps.length - 1);
  
  // Calculate the fill height for the timeline
  const fillHeight = `${(animatedProgress / 100) * 100}%`;

  return (
    <div className={styles.gradientWrapper}>
      <img src="/images/backgroundgradiant.png" alt="Gradient Background" className={styles.gradientBackground} />

      <div className={styles.innerBox}>
        <h2 className="text-2xl font-medium text-white mb-10">{text}<span className="animate-pulse">...</span></h2>

        <div className={styles.timelineWrapper}>
          <div className={styles.timeline}>
            <div 
              className={styles.timelineFill} 
              style={{ 
                height: fillHeight,
                transition: 'height 0.3s ease-in-out'
              }} 
            />
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`${styles.timelineStep} ${index <= currentStep ? styles.active : ''}`}
              >
                <div className={styles.square}>
                  <div className={styles.circle}>
                    {index <= currentStep && <div className={styles.dot} />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.textSteps}>
            {steps.map((step, index) => (
              <div key={index} className={styles.stepContent}>
                <h3 className={index <= currentStep ? styles.stepTitleActive : styles.stepTitle}>
                  {step.title}
                </h3>
                <p className={index <= currentStep ? styles.stepDescActive : styles.stepDesc}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
