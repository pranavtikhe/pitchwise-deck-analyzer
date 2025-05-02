// components/LoadingScreen.tsx
import React, { useEffect, useState } from 'react';
import styles from '@/styles/upload.module.scss';

const steps = [
  {
    title: 'Document Processing',
    description: 'Extracting text and data from pitch deck.'
  },
  {
    title: 'Startup Profile',
    description: 'Analyzing company information and business model.'
  },
  {
    title: 'Market Analysis',
    description: 'Evaluating market position and competition.'
  },
  {
    title: 'Sentiment Analysis',
    description: 'Assessing pitch clarity and investor impact.'
  },
  {
    title: 'Report Generation',
    description: 'Creating comprehensive investment analysis.'
  }
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
        <h2 className="text-[20px] font-medium text-white mb-1 font-fustat"><span className="animate-pulse">Generating...</span></h2>

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

          <div className="grid grid-cols-3 gap-4 place-items-center">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`${styles.stepBlock} ${index <= currentStep ? styles.completed : ''
                  } p-4 rounded-lg bg-[#1a1a1a] border border-[#333333] w-full max-w-xs`}
              >
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center gap-2  w-full">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-purple' : 'bg-gray-600 opacity-40'}`}>
                      <span className={`text-xs ${index <= currentStep ? 'text-white' : 'text-gray-400'}`}>✓</span>
                    </div>
                    <h3 className={`font-medium font-fustat ${index <= currentStep ? 'text-white' : 'text-gray-400'}`}>{step.title}</h3>
                  </div>
                  <div className="pl-7">
                    <p className="text-sm text-gray-400 text-left w-full break-words">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
    </div >
  );
};

export default LoadingScreen;
