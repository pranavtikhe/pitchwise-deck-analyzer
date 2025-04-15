import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface RadarChartProps {
  data: {
    product_viability: number;
    market_potential: number;
    sustainability: number;
    innovation: number;
    exit_potential: number;
    risk_factor: number;
    competitive_edge: number;
  };
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const chartData = [
    { subject: 'Product Viability', value: data.product_viability },
    { subject: 'Market Potential', value: data.market_potential },
    { subject: 'Sustainability', value: data.sustainability },
    { subject: 'Innovation', value: data.innovation },
    { subject: 'Exit Potential', value: data.exit_potential },
    { subject: 'Risk Factor', value: data.risk_factor },
    { subject: 'Competitive Edge', value: data.competitive_edge },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
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
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart; 