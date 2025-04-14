import React from 'react';
import { GeminiResponse } from '@/services/pdfService';
import RatingRadarChart from './RatingRadarChart';

interface ComprehensiveAnalysisProps {
  insights: GeminiResponse;
}

const ComprehensiveAnalysis: React.FC<ComprehensiveAnalysisProps> = ({ insights }) => {
  // Function to render a rating bar
  const renderRatingBar = (rating: number, label: string) => {
    const percentage = (rating / 10) * 100;
    const colorClass = 
      percentage >= 80 ? 'bg-green-500' : 
      percentage >= 60 ? 'bg-blue-500' : 
      percentage >= 40 ? 'bg-yellow-500' : 
      'bg-red-500';
    
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-card-foreground">{label}</span>
          <span className="text-sm font-medium text-card-foreground">{rating}/10</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${colorClass}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Function to render a section with title and content
  const renderSection = (title: string, content: string) => {
    if (!content || content === "Information not found in the pitch deck.") {
      return null;
    }
    
    return (
      <div className="mb-6 p-4 bg-card rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-card-foreground">{title}</h3>
        <p className="text-card-foreground">{content}</p>
      </div>
    );
  };

  return (
    <div className="comprehensive-analysis">
      <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground">Comprehensive Pitch Analysis</h2>
      
      {/* Radar Chart for Rating Analysis */}
      <RatingRadarChart insights={insights} />
      
      {/* Rating Breakdown */}
      <div className="mb-8 p-6 bg-card rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4 text-card-foreground">Rating Breakdown</h3>
        {renderRatingBar(insights.ratings.innovation_rating, "Innovation")}
        {renderRatingBar(insights.ratings.market_potential_rating, "Market Potential")}
        {renderRatingBar(insights.ratings.competitive_advantage_rating, "Competitive Advantage")}
        {renderRatingBar(insights.ratings.financial_strength_rating, "Financial Strength")}
        {renderRatingBar(insights.ratings.team_rating, "Team")}
      </div>
      
      {/* Key Insights */}
      {renderSection("Key Insights", insights.key_insights)}
      
      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {renderSection("Strengths", insights.strengths)}
        {renderSection("Weaknesses", insights.weaknesses)}
      </div>
      
      {/* Market Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {renderSection("Market Analysis", insights.market)}
        {renderSection("Market Comparison", insights.market_comparison)}
      </div>
      
      {/* Competitors */}
      {renderSection("Competitors", insights.competitors)}
      
      {/* Funding Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {renderSection("Funding Requirements", insights.funding)}
        {renderSection("Funding History", insights.funding_history)}
      </div>
      
      {/* Exit Potential */}
      {renderSection("Exit Potential", insights.exit_potential)}
      
      {/* Expert Opinions */}
      {renderSection("Expert Opinions", insights.expert_opinions)}
      
      {/* Key Questions */}
      {renderSection("Key Questions", insights.key_questions)}
      
      {/* Suggested Improvements */}
      {renderSection("Suggested Improvements", insights.suggested_improvements)}
      
      {/* Overall Reputation */}
      {renderSection("Overall Reputation", insights.overall_reputation)}
    </div>
  );
};

export default ComprehensiveAnalysis; 