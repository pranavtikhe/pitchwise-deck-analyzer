// components/LoadingScreen.tsx
import React, { useEffect, useState } from 'react';
import styles from '@/styles/upload.module.scss';

const steps = [
  { title: 'Document Processing' },
  { title: 'Startup Profile' },
  { title: 'Market Analysis' },
  { title: 'Sentiment Analysis' },
  { title: 'Report Generation' }
];

interface LoadingScreenProps {
  progress?: number;
  text?: string;
}

const LoadingScreen = ({ progress = 0, text = 'Generating' }: LoadingScreenProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const animationDuration = 500;
    const startTime = Date.now();
    const startProgress = animatedProgress;
    const targetProgress = progress;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentProgress = startProgress + (targetProgress - startProgress) * easeOut(progress);

      setAnimatedProgress(currentProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [progress]);

  const currentStep = Math.min(Math.floor(animatedProgress / 20), steps.length - 1);

  return (
    <div className={styles.gradientWrapper}>
      <img src="/images/backgroundgradiant.png" alt="Gradient Background" className={styles.gradientBackground} />

      <div className={styles.innerBox}>
        <h2 className="text-2xl font-medium text-white mb-10">{text}<span className="animate-pulse">...</span></h2>

        <div className={styles.simpleProgress}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${animatedProgress}%`,
                transition: 'width 0.3s ease-in-out'
              }} 
            />
          </div>
          <div className={styles.progressText}>{Math.round(animatedProgress)}%</div>
          
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`${styles.stepBlock} ${index <= currentStep ? styles.completed : ''}`}
              >
                <div className={styles.stepCheck}>
                  {index <= currentStep && '✓'}
                </div>
                <div className={styles.stepTitle}>{step.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
