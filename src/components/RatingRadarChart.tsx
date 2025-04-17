import React from 'react';
import { MistralResponse } from '@/services/pdfService';
import { RadarChart, PolarAngleAxis, PolarGrid, Radar, ResponsiveContainer } from 'recharts';
import { ChartTooltip } from '@/components/ui/chart';

interface RatingRadarChartProps {
  insights: MistralResponse;
}

const RatingRadarChart: React.FC<RatingRadarChartProps> = ({ insights }) => {
  // Function to generate insights based on rating value
  const generateInsight = (category: string, rating: number): string => {
    if (rating >= 9) {
      return `This pitch deck demonstrates exceptional ${category.toLowerCase()}. This is a significant strength that positions the company well for success.`;
    } else if (rating >= 7) {
      return `The pitch deck shows strong ${category.toLowerCase()}, indicating good potential in this area.`;
    } else if (rating >= 5) {
      return `The ${category.toLowerCase()} is average. There's room for improvement to make this aspect more compelling.`;
    } else if (rating >= 3) {
      return `The ${category.toLowerCase()} needs significant improvement. This is an area of concern that should be addressed.`;
    } else {
      return `The ${category.toLowerCase()} is weak. This is a critical area that requires immediate attention and enhancement.`;
    }
  };

  // Prepare data for the radar chart
  const chartData = [
    { 
      name: 'Innovation', 
      value: insights.ratings.innovation_rating,
      insights: insights.rating_insights?.innovation_insights || generateInsight('Innovation', insights.ratings.innovation_rating)
    },
    { 
      name: 'Market Potential', 
      value: insights.ratings.market_potential_rating,
      insights: insights.rating_insights?.market_potential_insights || generateInsight('Market Potential', insights.ratings.market_potential_rating)
    },
    { 
      name: 'Competitive Advantage', 
      value: insights.ratings.competitive_advantage_rating,
      insights: insights.rating_insights?.competitive_advantage_insights || generateInsight('Competitive Advantage', insights.ratings.competitive_advantage_rating)
    },
    { 
      name: 'Financial Strength', 
      value: insights.ratings.financial_strength_rating,
      insights: insights.rating_insights?.financial_strength_insights || generateInsight('Financial Strength', insights.ratings.financial_strength_rating)
    },
    { 
      name: 'Team', 
      value: insights.ratings.team_rating,
      insights: insights.rating_insights?.team_insights || generateInsight('Team', insights.ratings.team_rating)
    },
  ];

  // Generate overall insights if not provided
  const overallInsights = insights.rating_insights?.overall_insights || 
    `Overall Rating: ${insights.ratings.overall_rating}/10. ${
      insights.ratings.overall_rating >= 8 
        ? "This is a strong pitch deck with high potential for investor interest." 
        : insights.ratings.overall_rating >= 6 
          ? "This pitch deck has potential but would benefit from some improvements." 
          : "This pitch deck needs significant work before it's ready for investors."
    }`;

  // Custom tooltip component
  const ChartTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-md shadow-sm max-w-xs">
          <p className="font-medium text-card-foreground">{payload[0].payload.name}</p>
          <p className="text-sm text-card-foreground">
            Rating: <span className="font-semibold">{payload[0].value}/10</span>
          </p>
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs text-card-foreground">{payload[0].payload.insights}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-center text-card-foreground">Rating Analysis</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ 
                fill: 'hsl(var(--card-foreground))', 
                fontSize: 12,
                fontWeight: 'bold'
              }} 
            />
            <PolarGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <Radar
              name="Rating"
              dataKey="value"
              fill="hsl(var(--primary))"
              fillOpacity={0.8}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "hsl(var(--primary))",
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-card-foreground font-medium">
          Overall Rating: <span className="font-bold text-primary">{insights.ratings.overall_rating}/10</span>
        </p>
        <p className="mt-2 text-sm text-card-foreground max-w-md mx-auto">
          {overallInsights}
        </p>
      </div>
    </div>
  );
};

export default RatingRadarChart; 