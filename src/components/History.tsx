import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FileText, TrendingUp, Globe } from 'lucide-react';
import { HistoryEntry, getHistory } from '@/services/historyService';

const History = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  return (
    <div className="w-full max-w-[1325px] mx-auto p-4">
      <h1 className="text-3xl font-semibold text-white text-center mb-12">History</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/50 via-gray-900/50 to-blue-900/50 backdrop-blur-xl border border-white/10"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50" />
            
            <div className="relative p-6 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {entry.insights.industry_type}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {format(new Date(entry.timestamp), 'MMMM dd, yyyy')} at {format(new Date(entry.timestamp), 'HH:mm')}
                  </p>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${entry.riskLevel === 'High Risk' ? 'bg-red-500/20 text-red-300' :
                    entry.riskLevel === 'Medium Risk' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'}
                `}>
                  {entry.riskLevel}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  entry.status === 'Completed' ? 'bg-green-400' :
                  entry.status === 'Failed' ? 'bg-red-400' : 'bg-yellow-400'
                }`} />
                <span className="text-sm text-gray-400">{entry.status}</span>
                <span className="text-sm text-gray-400 ml-auto">
                  {entry.clausesIdentified} clauses identified
                </span>
              </div>

              {/* Key Statistics */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400">Key Statistics</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Pitch Clarity: {entry.insights.pitch_clarity}/10</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Investment Score: {entry.insights.investment_score}/10</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">Market Position: {entry.insights.market_position}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History; 