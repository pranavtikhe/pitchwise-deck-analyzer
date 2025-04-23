import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  PolarRadiusAxis,
  Customized,
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

const ScoreIndicator = (props: any) => {
  const { cx, cy, value } = props;
  
  if (value >= 8) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="#4CAF50"
          stroke="#fff"
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy}
          dy={4}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
          fontWeight="bold"
        >
          {value}
        </text>
      </g>
    );
  }
  
  if (value <= 4) {
    return (
      <g>
        <polygon
          points={`${cx - 6},${cy + 6} ${cx},${cy - 6} ${cx + 6},${cy + 6}`}
          fill="#F44336"
          stroke="#fff"
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy}
          dy={4}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
          fontWeight="bold"
        >
          {value}
        </text>
      </g>
    );
  }
  
  return null;
};

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  // Ensure all values are numbers and within range
  const normalizeValue = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return 0;
    return Math.min(Math.max(value, 0), 10);
  };

  const chartData = [
    { 
      subject: 'Product Viability', 
      value: normalizeValue(data.product_viability),
      analysis: data.analysis?.product_viability || 'Analysis pending'
    },
    { 
      subject: 'Financial Health', 
      value: normalizeValue(data.financial_health),
      analysis: data.analysis?.financial_health || 'Analysis pending'
    },
    { 
      subject: 'Market Potential', 
      value: normalizeValue(data.market_potential),
      analysis: data.analysis?.market_potential || 'Analysis pending'
    },
    { 
      subject: 'Sustainability', 
      value: normalizeValue(data.sustainability),
      analysis: data.analysis?.sustainability || 'Analysis pending'
    },
    { 
      subject: 'Innovation', 
      value: normalizeValue(data.innovation),
      analysis: data.analysis?.innovation || 'Analysis pending'
    },
    { 
      subject: 'Exit Potential', 
      value: normalizeValue(data.exit_potential),
      analysis: data.analysis?.exit_potential || 'Analysis pending'
    },
    { 
      subject: 'Risk Factors', 
      value: normalizeValue(data.risk_factors),
      analysis: data.analysis?.risk_factors || 'Analysis pending'
    },
    { 
      subject: 'Customer Traction', 
      value: normalizeValue(data.customer_traction),
      analysis: data.analysis?.customer_traction || 'Analysis pending'
    },
    { 
      subject: 'Competitive Advantage', 
      value: normalizeValue(data.competitive_advantage),
      analysis: data.analysis?.competitive_advantage || 'Analysis pending'
    },
    { 
      subject: 'Team Strength', 
      value: normalizeValue(data.team_strength),
      analysis: data.analysis?.team_strength || 'Analysis pending'
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const fillOpacity = 0.3 + (value / 10) * 0.7; // Dynamic opacity based on value
      
      return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <p className="text-white font-bold">{payload[0].payload.subject}</p>
          <p className="text-gray-300">Score: {value}/10</p>
          <p className="text-gray-400 mt-2 text-sm">{payload[0].payload.analysis}</p>
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-700 rounded-full">
              <div 
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${value * 10}%`, opacity: fillOpacity }}
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsRadarChart
        data={chartData}
        outerRadius={150}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <PolarGrid 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeDasharray="3 3"
        />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 10]}
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
        />
        <Radar
          name="Performance"
          dataKey="value"
          stroke="#4776E6"
          fill="#4776E6"
          fillOpacity={0.3}
          dot={false}
          animationDuration={1500}
          animationEasing="ease-in-out"
        />
        <Customized component={ScoreIndicator} />
        <Tooltip content={<CustomTooltip />} />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart; 