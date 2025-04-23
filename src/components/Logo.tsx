import React from 'react';

interface LogoProps {
    width?: number;
    height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 160, height = 60 }) => {
    return (
        <div style={{ width, height }}>
            <img 
                src="/images/navlogo.svg" 
                alt="LawBit Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
        </div>
    );
};

export default Logo; 