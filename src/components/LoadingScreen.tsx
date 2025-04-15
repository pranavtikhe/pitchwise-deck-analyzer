import React from 'react';
import styles from '@/styles/upload.module.scss';

const steps = [
  {
    title: 'Document Processing',
    description: 'Extracting text and data from pitch deck.',
    status: 'completed'
  },
  {
    title: 'Startup Profile',
    description: 'Analyzing company information and business model.',
    status: 'completed'
  },
  {
    title: 'Market Analysis',
    description: 'Evaluating market position and competition.',
    status: 'in-progress'
  },
  {
    title: 'Sentiment Analysis',
    description: 'Assessing pitch clarity and investor impact.',
    status: 'pending'
  },
  {
    title: 'Report Generation',
    description: 'Creating comprehensive investment analysis.',
    status: 'pending'
  }
];

const LoadingScreen = () => {
  return (
    <div className={styles.gradientWrapper}>
      <img
        src="/images/backgroundgradiant.png"
        alt="Gradient Background"
        className={styles.gradientBackground}
      />
      <div className={styles.innerBox}>
        <h2 className="text-2xl font-medium text-white mb-8">Generating...</h2>
        
        <div className="flex flex-col items-center space-y-8 max-w-xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="w-full flex items-start gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  step.status === 'completed' ? 'bg-[#4776E6]' :
                  step.status === 'in-progress' ? 'bg-[#4776E6] animate-pulse' :
                  'bg-gray-600'
                }`} />
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-24 ${
                    step.status === 'completed' ? 'bg-[#4776E6]' :
                    'bg-gray-600'
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className={`text-lg font-medium mb-1 ${
                  step.status === 'completed' || step.status === 'in-progress' 
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${
                  step.status === 'completed' || step.status === 'in-progress'
                    ? 'text-gray-300' 
                    : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 