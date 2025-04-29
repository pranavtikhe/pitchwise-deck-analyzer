import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import styles from "./PrivacyPolicy.module.sass";
import Navbar from "./Navbar";

interface Section {
  title: string;
  content: React.ReactNode;
}

const TermsOfUse: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const navigate = useNavigate();

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections: Section[] = [
    {
      title: "1. Acceptance of Terms",
      content: (
        <p>
          By accessing and using PitchWise, you agree to be bound by these Terms
          of Use. If you do not agree to these terms, please do not use our
          services.
        </p>
      ),
    },
    {
      title: "2. Service Description",
      content: (
        <>
          <p>PitchWise provides:</p>
          <ul>
            <li>• AI-powered pitch deck analysis</li>
            <li>• Investment insights and recommendations</li>
            <li>• Document processing and analysis services</li>
            <li>• Report generation and analytics</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. User Obligations",
      content: (
        <>
          <p>Users must:</p>
          <ul>
            <li>• Provide accurate and complete information</li>
            <li>• Maintain the security of their account credentials</li>
            <li>• Use the service in compliance with applicable laws</li>
            <li>• Not attempt to circumvent any service limitations or restrictions</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Intellectual Property",
      content: (
        <>
          <p>
            All content and materials available through PitchWise are protected
            by:
          </p>
          <ul>
            <li>• Copyright laws</li>
            <li>• Trademark rights</li>
            <li>• Other proprietary rights</li>
          </ul>
          <p>
            Users may not copy, modify, distribute, or create derivative works
            without explicit permission.
          </p>
        </>
      ),
    },
    {
      title: "5. Data Usage",
      content: (
        <>
          <p>By using our service:</p>
          <ul>
            <li>• You grant us permission to process your uploaded documents</li>
            <li>• We maintain confidentiality of your data</li>
            <li>• We use data in accordance with our Privacy Policy</li>
            <li>• We do not share your data with unauthorized third parties</li>
          </ul>
        </>
      ),
    },
    {
      title: "6. Limitation of Liability",
      content: (
        <p>
          PitchWise provides analysis and insights as informational resources
          only. We are not responsible for investment decisions made based on
          our analysis. Users should conduct their own due diligence before
          making investment decisions.
        </p>
      ),
    },
    {
      title: "7. Service Modifications",
      content: (
        <p>
          We reserve the right to modify, suspend, or discontinue any part of
          our service at any time. We will provide notice of significant changes
          when possible.
        </p>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.privacyContainer}>
            <div className={styles.headerRow}>
              <div className={styles.titleContainer}>
                <h1 className={styles.pageTitle}>Terms of Use</h1>
              </div>
              <p className={styles.effectiveDate}>Effective Date: 20/02/26</p>
            </div>

            <div className={styles.welcomeSection}>
              <p>
                Welcome to PitchWise. By using our services, you agree to these
                terms. Please read them carefully before using our platform.
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
                      className={`${styles.arrowIcon} ${
                        openSection === index ? styles.rotated : ""
                      }`}
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

export default TermsOfUse;
