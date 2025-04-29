import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import styles from './PrivacyPolicy.module.sass';
import Navbar from './Navbar';

interface Section {
  title: string;
  content: React.ReactNode;
}

const ResponsibleAI: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections: Section[] = [
    {
      title: "1. Overview",
      content: (
        <>
          <p>
            This platform may incorporate artificial intelligence (AI) or machine learning (ML) systems to support tasks such as content generation, recommendation, classification, or decision support.
          </p>
          <p>
            We are committed to ensuring that all AI systems are used ethically, responsibly, and in alignment with legal and organizational standards.
          </p>
        </>
      )
    },
    {
      title: "2. Principles for AI Use",
      content: (
        <>
          <p>We follow these core principles:</p>
          <ul>
            <li>• Transparency: Users will be clearly informed when AI-generated content or recommendations are presented.</li>
            <li>• Accountability: AI outcomes are monitored regularly and remain subject to human oversight and review.</li>
            <li>• Fairness: AI systems are developed and tested to minimize bias and discrimination.</li>
            <li>• Privacy Protection: AI models will not process sensitive personal data without consent and proper safeguards.</li>
            <li>• Explainability: Where feasible, AI-driven decisions will include rationale or explanatory output for user interpretation.</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Human-in-the-Loop (HITL)",
      content: (
        <p>
          No AI model will autonomously make decisions with legal, employment, disciplinary, or financial consequences without human verification and authorization.
        </p>
      )
    },
    {
      title: "4. Feedback and Reporting",
      content: (
        <>
          <p>Users are encouraged to report:</p>
          <ul>
            <li>• Inaccurate or biased AI outputs</li>
            <li>• Concerns about the use of AI</li>
            <li>• Requests to review how AI-generated results are used</li>
          </ul>
          <p>Feedback should be submitted via designated internal channels for audit and improvement.</p>
        </>
      )
    }
  ];

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.privacyContainer}>
            <div className={styles.headerRow}>
              <h1 className={styles.pageTitle}>Responsible AI Usage Policy</h1>
              <p className={styles.effectiveDate}>Effective Date: 20/02/26</p>
            </div>
            
            <div className={styles.welcomeSection}>
              <p>
                Our commitment to responsible AI usage ensures that our technology is developed and deployed in a manner that is ethical, transparent, and beneficial to all users.
              </p>
            </div>

            <div className={styles.sectionsContainer}>
              {sections.map((section, index) => (
                <div key={index} className={styles.section}>
                  <div 
                    className={styles.sectionHeader}
                    onClick={() => toggleSection(index)}
                  >
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                    <ChevronDownIcon 
                      className={`${styles.arrowIcon} ${openSection === index ? styles.rotated : ''}`}
                      width={24}
                      height={24}
                    />
                  </div>
                  {openSection === index && (
                    <div className={styles.sectionContent}>
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsibleAI; 