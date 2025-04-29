import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.links}>
            <Link to="/terms-of-use">Terms of use</Link>
            <span>•</span>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            
            <span>•</span>
            <Link to="/responsible-ai">Responsible AI</Link>
          </div>
          <div className={styles.copyright}>
            <p>
              Copyright 2025. All rights reserved. &nbsp;&nbsp; Spider AI, A thing by&nbsp;
            </p>
          </div>
          <img 
            src="/neuralpath.svg" 
            alt="Neural Paths" 
            width={140} 
            height={60} 
            style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '0px' }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer; 