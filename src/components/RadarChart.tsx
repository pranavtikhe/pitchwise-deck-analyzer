import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarChartProps {
  data: {
    product_viability: number;
    market_potential: number;
    sustainability: number;
    innovation: number;
    exit_potential: number;
    risk_factors: number;
    financial_health: number;
    customer_traction: number;
    competitive_advantage: number;
    team_strength: number;
    analysis?: {
      product_viability: string;
      financial_health: string;
      market_potential: string;
      sustainability: string;
      innovation: string;
      exit_potential: string;
      risk_factors: string;
      customer_traction: string;
      competitive_advantage: string;
      team_strength: string;
    };
  };
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const chartData = [
    { 
      subject: 'Product Viability', 
      value: data.product_viability,
      analysis: data.analysis?.product_viability || 'Analysis pending'
    },
    { 
      subject: 'Financial Health', 
      value: data.financial_health,
      analysis: data.analysis?.financial_health || 'Analysis pending'
    },
    { 
      subject: 'Market Potential', 
      value: data.market_potential,
      analysis: data.analysis?.market_potential || 'Analysis pending'
    },
    { 
      subject: 'Sustainability', 
      value: data.sustainability,
      analysis: data.analysis?.sustainability || 'Analysis pending'
    },
    { 
      subject: 'Innovation', 
      value: data.innovation,
      analysis: data.analysis?.innovation || 'Analysis pending'
    },
    { 
      subject: 'Exit Potential', 
      value: data.exit_potential,
      analysis: data.analysis?.exit_potential || 'Analysis pending'
    },
    { 
      subject: 'Risk Factors', 
      value: data.risk_factors,
      analysis: data.analysis?.risk_factors || 'Analysis pending'
    },
    { 
      subject: 'Customer Traction', 
      value: data.customer_traction,
      analysis: data.analysis?.customer_traction || 'Analysis pending'
    },
    { 
      subject: 'Competitive Advantage', 
      value: data.competitive_advantage,
      analysis: data.analysis?.competitive_advantage || 'Analysis pending'
    },
    { 
      subject: 'Team Strength', 
      value: data.team_strength,
      analysis: data.analysis?.team_strength || 'Analysis pending'
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <p className="text-white font-bold">{payload[0].payload.subject}</p>
          <p className="text-gray-300">Score: {payload[0].value}/10</p>
          <p className="text-gray-400 mt-2 text-sm">{payload[0].payload.analysis}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsRadarChart data={chartData}>
        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <Radar
          name="Performance"
          dataKey="value"
          stroke="#4776E6"
          fill="#4776E6"
          fillOpacity={0.3}
        />
        <Tooltip content={<CustomTooltip />} />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart; 