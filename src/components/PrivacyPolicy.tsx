import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import styles from "./PrivacyPolicy.module.sass";
import Navbar from "./Navbar";

interface Section {
  title: string;
  content: React.ReactNode;
}

const PrivacyPolicy: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections: Section[] = [
    {
      title: "1. Purpose",
      content: (
        <p>
          This Privacy Policy outlines how we collect, use, store, and protect data on this platform to ensure user trust, transparency, and legal compliance.
        </p>
      )
    },
    {
      title: "2. Data Collection",
      content: (
        <>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>• Technical Data: IP address, device information, browser type, operating system</li>
            <li>• Usage Data: Login timestamps, pages accessed, session duration, action logs</li>
            <li>• Optional Personal Data: Any personal or professional details explicitly submitted by the user (e.g., via forms or user profiles)</li>
          </ul>
          <p>We do not collect any personal data without user awareness or consent.</p>
        </>
      )
    },
    {
      title: "3. Purpose of Data Use",
      content: (
        <>
          <p>Collected data is used for:</p>
          <ul>
            <li>• Platform performance monitoring and optimization</li>
            <li>• User access verification and session management</li>
            <li>• Security auditing and incident response</li>
            <li>• Analytics and service improvement</li>
          </ul>
          <p>We do not sell, trade, or rent user data to any third parties.</p>
        </>
      )
    },
    {
      title: "4. Cookies and Tracking",
      content: (
        <>
          <p>We may use cookies, local storage, and similar tracking technologies to:</p>
          <ul>
            <li>• Maintain active user sessions</li>
            <li>• Save user preferences</li>
            <li>• Track aggregate usage analytics</li>
          </ul>
          <p>You can control or disable cookies via browser settings, though some functionality may be affected.</p>
        </>
      )
    },
    {
      title: "5. Data Retention",
      content: (
        <p>
          User data is retained only for as long as necessary for the purposes stated above, or as required by internal policy or legal compliance.
        </p>
      )
    },
    {
      title: "6. Security Measures",
      content: (
        <>
          <p>We implement industry-standard safeguards including:</p>
          <ul>
            <li>• Role-based access control (RBAC)</li>
            <li>• Encryption of data in transit and at rest</li>
            <li>• Secure authentication mechanisms</li>
            <li>• Regular security audits and vulnerability patching</li>
          </ul>
        </>
      )
    },
    {
      title: "7. User Rights",
      content: (
        <p>
          Users may request to review, update, or delete their data where applicable, in line with internal governance protocols. Such requests should be routed through the data protection or system administrator team.
        </p>
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
              <h1 className={styles.pageTitle}>Privacy Policy</h1>
              <p className={styles.effectiveDate}>Effective Date: 20/02/26</p>
            </div>
            
            <div className={styles.welcomeSection}>
              <p>
                PitchWise values your privacy and is committed to protecting your personal information. 
                This Privacy Policy outlines how we collect, use, share, and safeguard your data 
                when you visit our website and use our services.
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

export default PrivacyPolicy; 