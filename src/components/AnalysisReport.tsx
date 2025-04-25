import React, { useEffect, useState } from "react";
import { MistralResponse } from "../services/pdfService";
import { format } from "date-fns";
import styles from "@/styles/upload.module.scss";
import {
  Star,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Share2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  FileChartPie,
  Download
} from "lucide-react";
import { saveToHistory } from "@/services/historyService";

interface AnalysisReportProps {
  data?: MistralResponse & {
    analyzedAt: Date;
  };
}

interface ReputationSource {
  sentiment: string;
  score: number;
  rating: number;
}

function clampScore(score: number): number {
  return Math.min(Math.max(score, 0), 10);
}

function formatSourceName(source: string): string {
  return source
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatParameterName(parameter: string): string {
  return parameter
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatMetricName(metric: string): string {
  return metric
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function DealTermCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data }) => {
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Save to history when component mounts (analysis is complete)
    if (data) {
      saveToHistory(data);
    }
  }, [data]);

  // Handle loading state
  if (!data) {
    return (
      <div className="font-fustat flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Loading analysis report...</p>
      </div>
    );
  }

  // Extract data from the response
  // Ensure all required objects exist with defaults
  const profile = {
    companyName: data.company_overview?.company_name || 'N/A',
    industry: data.company_overview?.industry || 'N/A',
    businessModel: data.company_overview?.business_model || 'N/A',
    keyOfferings: data.company_overview?.key_offerings || 'N/A',
    marketPosition: data.company_overview?.market_position || 'N/A',
    foundedOn: data.company_overview?.founded_on || 'N/A'
  };

  // Ensure all required arrays exist with defaults
  const strengths = data.strengths || [];
  const weaknesses = data.weaknesses || [];
  const competitors = data.competitor_analysis?.competitors || [];
  const recommendations: string[] = [];
  const fundingHistory = data.funding_history?.rounds?.map(round => ({
    round: round.type,
    amount: round.amount,
    investors: round.key_investors,
    status: 'N/A'
  })) || [];
  const expertOpinions = data.expert_opinions?.map(opinion => ({
    name: opinion.name,
    affiliation: opinion.affiliation,
    summary: opinion.summary,
    reference: opinion.reference
  })) || [];

  // Define scores for investment recommendation
  const scores = {
    investmentScore: data.investment_score || 5,
    roiScore: data.final_verdict?.exit_potential || 5,
    riskScore: data.final_verdict?.risk_factor || 5
  };

  // Define overview for investment recommendation
  const overview = {
    investmentRecommendation: 'Based on the analysis, this company shows promise but has some areas that need improvement before being considered a strong investment opportunity.',
    finalNote: 'This analysis is based on the information provided in the pitch deck and market research. Investors should conduct additional due diligence before making investment decisions.'
  };

  // Mock data for missing parts in the API response
  const marketComparison = { 
    metrics: {
      marketShare: {
        startup: '2%',
        competitor1: '15%',
        competitor2: '12%',
        competitor3: '8%'
      },
      growth: {
        startup: '58%',
        competitor1: '12%',
        competitor2: '8%',
        competitor3: '15%'
      },
      funding: {
        startup: '$2.5M',
        competitor1: '$25M',
        competitor2: '$18M',
        competitor3: '$12M'
      }
    }
  };

  const exitPotential = {
    likelihood: 7,
    potentialValue: '$50M - $100M'
  };

  const reputationAnalysis = {
    sources: {
      newsMedia: { sentiment: 'Positive', score: 8, rating: 4 },
      socialMedia: { sentiment: 'Positive', score: 7, rating: 3 },
      investorReviews: { sentiment: 'Neutral', score: 6, rating: 3 },
      customerFeedback: { sentiment: 'Positive', score: 8, rating: 4 }
    },
    overall: { sentiment: 'Positive', score: 7, rating: 4 }
  };

  const expertConclusion = {
    productViability: data.final_verdict?.product_viability || 0,
    marketPotential: data.final_verdict?.market_potential || 0,
    sustainability: data.final_verdict?.sustainability || 0,
    innovation: data.final_verdict?.innovation || 0,
    exitPotential: data.final_verdict?.exit_potential || 0,
    riskFactors: data.final_verdict?.risk_factor || 0,
    competitiveAdvantage: data.final_verdict?.competitive_edge || 0
  };

  const dealStructure = data.proposed_deal_structure ? {
    investmentAmount: data.proposed_deal_structure.investment_amount || 'N/A',
    equityStake: data.proposed_deal_structure.equity_stake || 'N/A',
    valuationCap: data.proposed_deal_structure.valuation_cap || 'N/A',
    liquidationPreference: '1x',
    antiDilution: true,
    boardSeat: false,
    vestingSchedule: '4 years with 1 year cliff',
    otherTerms: []
  } : {
    investmentAmount: 'N/A',
    equityStake: 'N/A',
    valuationCap: 'N/A',
    liquidationPreference: 'N/A',
    antiDilution: false,
    boardSeat: false,
    vestingSchedule: 'N/A',
    otherTerms: []
  };

  const finalVerdict = {
    summary: `${profile.companyName} shows potential in the ${profile.industry} market with a ${data.investment_score}/10 investment score.`,
    timeline: '18-24 months to profitability',
    potentialOutcome: 'Acquisition by industry leader'
  };

  // Placeholder for key questions
  const keyQuestions = [
    { category: 'Business Model', question: 'How do you plan to scale the customer acquisition process?' },
    { category: 'Financial', question: 'What is your burn rate and runway with the current funding?' },
    { category: 'Market', question: 'How do you differentiate from your closest competitors?' },
    { category: 'Team', question: 'Are there any key hires planned in the next 6 months?' }
  ];

  // Clamp all scores to be between 0 and 10
  const clampedExpertConclusion = {
    ...expertConclusion,
    productViability: clampScore(expertConclusion.productViability),
    marketPotential: clampScore(expertConclusion.marketPotential),
    sustainability: clampScore(expertConclusion.sustainability),
    innovation: clampScore(expertConclusion.innovation),
    exitPotential: clampScore(expertConclusion.exitPotential),
    riskFactors: clampScore(expertConclusion.riskFactors),
    competitiveAdvantage: clampScore(expertConclusion.competitiveAdvantage)
  };

  const clampedExitPotential = {
    ...exitPotential,
    likelihood: clampScore(exitPotential.likelihood)
  };

  // Update the reputationAnalysis scores
  const clampedReputationAnalysis = {
    ...reputationAnalysis,
    sources: {
      newsMedia: { ...reputationAnalysis.sources.newsMedia, score: clampScore(reputationAnalysis.sources.newsMedia.score) },
      socialMedia: { ...reputationAnalysis.sources.socialMedia, score: clampScore(reputationAnalysis.sources.socialMedia.score) },
      investorReviews: { ...reputationAnalysis.sources.investorReviews, score: clampScore(reputationAnalysis.sources.investorReviews.score) },
      customerFeedback: { ...reputationAnalysis.sources.customerFeedback, score: clampScore(reputationAnalysis.sources.customerFeedback.score) }
    },
    overall: { ...reputationAnalysis.overall, score: clampScore(reputationAnalysis.overall.score) }
  };

  return (
    <div className="relative bg-[#121212] text-white min-h-screen">
      <div className="flex justify-end mb-6 mr-6 pt-4">
        <button 
          className="bg-[#2A2A2A] hover:bg-[#333333] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          onClick={() => window.location.href = '/spider'}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">AI-Powered Pitch Deck & Investment Analysis</h1>
          
          <div className={`${styles.gradientWrapper} mb-8`}>
      <img
        src="/images/backgroundgradiant.png"
        alt="Gradient Background"
        className={styles.gradientBackground}
      />
            <div className={`${styles.innerBox} p-6`}>
              <div className="mb-4">
                <h2 className="text-xl font-medium mb-2">Analysis for: {profile.companyName}</h2>
                <p className="text-gray-400">{profile.industry} | Last updated: {format(data.analyzedAt, "MM/dd/yyyy")}</p>
              </div>
              
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 md:mt-8">
                <div className="bg-[#212228] p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <FileChartPie className="text-xl text-teal-500 mr-3" />
                    <h3 className="text-base font-medium">Pitch Analysis</h3>
        </div>

                  <div className="flex flex-col">
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Clarity Score:</p>
                      <p className="text-xl font-bold">{clampedExpertConclusion.productViability}/10</p>
            </div>
            <div>
                      <p className="text-gray-400 text-sm mb-1">Sentiment:</p>
                      <div className="flex items-center">
                        <span className="text-green-500 font-medium">{clampedReputationAnalysis.overall.sentiment}</span>
              </div>
            </div>
          </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-300">AI detected <span className="font-medium">{strengths.length} strengths</span> and <span className="font-medium">{weaknesses.length} potential issues</span></p>
            </div>
                </div>

                <div className="bg-[#212228] p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <DollarSign className="text-xl text-teal-500 mr-3" />
                    <h3 className="text-base font-medium">Investment Potential</h3>
                      </div>
                      
                  <div className="flex flex-col">
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Score:</p>
                      <p className="text-xl font-bold">{clampedExpertConclusion.exitPotential}/10</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Exit Potential:</p>
                      <p className="font-medium">USD {clampedExitPotential.potentialValue}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-300">High growth rate with <span className="font-medium">moderate risk factors</span></p>
                  </div>
                  </div>
                  
                <div className="bg-[#212228] p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <Target className="text-xl text-teal-500 mr-3" />
                    <h3 className="text-base font-medium">Market Position</h3>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Classification:</p>
                      <p className="text-xl font-bold">{profile.marketPosition}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Industry:</p>
                      <p className="font-medium text-gray-300">{profile.industry}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-300">Competing with <span className="font-medium">{competitors.length} established players</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Company Overview */}
        <div className={`${styles.gradientWrapper} mb-8`}>
          <img
            src="/images/backgroundgradiant.png"
            alt="Gradient Background"
            className={styles.gradientBackground}
          />
          <div className={`${styles.innerBox} p-6`}>
            <h2 className="text-xl font-bold mb-6">Company Overview</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="border-b border-gray-700 p-4">
                <p className="text-gray-400 mb-1">Company Name</p>
                <p className="text-white">{profile.companyName}</p>
              </div>
              
              <div className="border-b border-gray-700 p-4">
                <p className="text-gray-400 mb-1">Industry</p>
                <p className="text-white">{profile.industry}</p>
              </div>
              
              <div className="border-b border-gray-700 p-4">
                <p className="text-gray-400 mb-1">Market Position</p>
                <p className="text-white">{profile.marketPosition}</p>
              </div>
              
              <div className="border-b border-gray-700 p-4">
                <p className="text-gray-400 mb-1">Founded</p>
                <p className="text-white">{profile.foundedOn || 'N/A'}</p>
              </div>
              
              <div className="border-b border-gray-700 p-4">
                <p className="text-gray-400 mb-1">Business Model</p>
                <p className="text-white">{profile.businessModel}</p>
              </div>
              
              <div className="border-b border-gray-700 p-4">
                <p className="text-gray-400 mb-1">Key Offerings</p>
                <p className="text-white">{profile.keyOfferings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`${styles.gradientWrapper}`}>
            <img
              src="/images/backgroundgradiant.png"
              alt="Gradient Background"
              className={styles.gradientBackground}
            />
            <div className={`${styles.innerBox} p-6`}>
              <h2 className="text-xl font-bold mb-6">Strengths & Weaknesses</h2>
              
              <div>
                <h4 className="text-base text-green-500 mb-4">Strengths (Pros)</h4>
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                      <span className="text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6">
                <h4 className="text-base text-red-500 mb-4">Weaknesses (Cons)</h4>
                <ul className="space-y-2">
                  {weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                      <span className="text-gray-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
          </div>
        </div>
      </div>

          {/* Funding History */}
          <div className={`${styles.gradientWrapper}`}>
            <img
              src="/images/backgroundgradiant.png"
              alt="Gradient Background"
              className={styles.gradientBackground}
            />
            <div className={`${styles.innerBox} p-6`}>
              <h2 className="text-xl font-bold mb-6">Funding History</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-2 font-normal text-gray-400">Round</th>
                      <th className="py-3 px-2 font-normal text-gray-400">Amount</th>
                      <th className="py-3 px-2 font-normal text-gray-400">Key Investors</th>
                      <th className="py-3 px-2 font-normal text-gray-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundingHistory.length > 0 ? (
                      fundingHistory.map((round, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="py-3 px-2">{round.round}</td>
                          <td className="py-3 px-2">{round.amount}</td>
                          <td className="py-3 px-2">{Array.isArray(round.investors) ? round.investors.join(', ') : round.investors}</td>
                          <td className="py-3 px-2">{round.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500">
                          No funding history data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Competitor Comparison */}
        <div className={`${styles.gradientWrapper} mb-8`}>
          <img
            src="/images/backgroundgradiant.png"
            alt="Gradient Background"
            className={styles.gradientBackground}
          />
          <div className={`${styles.innerBox} p-6`}>
            <h2 className="text-xl font-bold mb-6">Competitor Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 px-2 font-normal text-gray-400">Competitor</th>
                    <th className="py-3 px-2 font-normal text-gray-400">Market Position</th>
                    <th className="py-3 px-2 font-normal text-gray-400">Amount Raised</th>
                    <th className="py-3 px-2 font-normal text-gray-400">Key Strengths</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.length > 0 ? (
                    competitors.map((competitor, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-3 px-2">{competitor.name}</td>
                        <td className="py-3 px-2">{competitor.market_position}</td>
                        <td className="py-3 px-2">{competitor.amount_raised}</td>
                        <td className="py-3 px-2">{competitor.strengths}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        No competitor data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Final Verdict */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`${styles.gradientWrapper}`}>
            <img
              src="/images/backgroundgradiant.png"
              alt="Gradient Background"
              className={styles.gradientBackground}
            />
            <div className={`${styles.innerBox} p-6`}>
              <h2 className="text-xl font-bold mb-4">Investment Recommendation</h2>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getRecommendationColor(scores.investmentScore)}`}></div>
                <h3 className="text-lg font-semibold">
                  {getRecommendationText(scores.investmentScore)}
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {overview.investmentRecommendation || 'No recommendation available'}
              </p>
              
              <div className="mt-4">
                <h4 className="text-base text-gray-400 mb-2">Potential ROI</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 h-2 rounded-full">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                      style={{ width: `${scores.roiScore * 10}%` }}
                    ></div>
                </div>
                  <span className="text-white">{scores.roiScore}/10</span>
                </div>
                </div>
              
              <div className="mt-4">
                <h4 className="text-base text-gray-400 mb-2">Risk Assessment</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 h-2 rounded-full">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full" 
                      style={{ width: `${scores.riskScore * 10}%` }}
                    ></div>
                </div>
                  <span className="text-white">{scores.riskScore}/10</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.gradientWrapper}`}>
            <img
              src="/images/backgroundgradiant.png"
              alt="Gradient Background"
              className={styles.gradientBackground}
            />
            <div className={`${styles.innerBox} p-6`}>
              <h2 className="text-xl font-bold mb-4">Next Steps</h2>
              
              <ul className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-3 flex-shrink-0">
                      {index + 1}.
                    </span>
                    <span className="text-gray-300">{recommendation}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                <h4 className="text-base text-gray-300 mb-2">Final Note</h4>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {overview.finalNote || 'This analysis is based on the information provided in the pitch deck and market research. Investors should conduct additional due diligence before making investment decisions.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center pb-8">
          <button 
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
            onClick={() => window.location.href = '/spider'}
          >
            Generate New Report
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get recommendation color
const getRecommendationColor = (score: number): string => {
  if (score >= 7) return 'bg-green-500';
  if (score >= 4) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Helper function to get recommendation text
const getRecommendationText = (score: number): string => {
  if (score >= 7) return 'Strong Investment Opportunity';
  if (score >= 4) return 'Potential with Reservations';
  return 'Not Recommended for Investment';
};

export default AnalysisReport;