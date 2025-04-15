import React from 'react';
import { GeminiResponse } from '@/services/pdfService';

interface OverallRatingCardProps {
  insights: GeminiResponse;
}

const OverallRatingCard: React.FC<OverallRatingCardProps> = ({ insights }) => {
  // Calculate overall rating from final verdict scores
  const calculateOverallRating = () => {
    const scores = [
      insights.final_verdict.product_viability,
      insights.final_verdict.market_potential,
      insights.final_verdict.sustainability,
      insights.final_verdict.innovation,
      insights.final_verdict.exit_potential,
      insights.final_verdict.risk_factor,
      insights.final_verdict.competitive_edge
    ];
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return Math.round((sum / scores.length) * 10) / 10; // Round to 1 decimal place
  };

  const rating = calculateOverallRating();
  const percentage = (rating / 10) * 100;
  
  // Determine color based on rating
  const getColorClass = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get rating description
  const getRatingDescription = () => {
    if (rating >= 9) return 'Outstanding pitch with exceptional potential';
    if (rating >= 8) return 'Excellent pitch with strong potential';
    if (rating >= 7) return 'Very good pitch with solid potential';
    if (rating >= 6) return 'Good pitch with some areas for improvement';
    if (rating >= 5) return 'Average pitch that needs refinement';
    if (rating >= 4) return 'Below average pitch with significant gaps';
    if (rating >= 3) return 'Poor pitch that needs substantial work';
    return 'Very poor pitch that needs complete overhaul';
  };
  
  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-bold mb-2 text-card-foreground">Overall Pitch Rating</h3>
      
      <div className="flex flex-col items-center justify-center my-6">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Circular progress bar */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${percentage * 4.4} 440`}
              className={`${getColorClass()} transition-all duration-1000 ease-out`}
            />
          </svg>
          
          {/* Rating number in the center */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-card-foreground">{rating}</span>
            <span className="text-sm text-muted-foreground">out of 10</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-lg font-medium mb-2 text-card-foreground">{getRatingDescription()}</p>
        <div className="w-full bg-muted rounded-full h-2.5 mb-2">
          <div 
            className={`h-2.5 rounded-full ${getColorClass()}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
};

export default OverallRatingCard; 