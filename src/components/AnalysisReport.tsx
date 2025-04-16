import React, { useEffect, useState } from 'react';
import { GeminiResponse } from '@/services/pdfService';
import { format } from 'date-fns';
import styles from '@/styles/upload.module.scss';
import RadarChart from './RadarChart';
import { FileText, Globe, Download, History as HistoryIcon } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { saveToHistory } from '@/services/historyService';
import History from './History';

interface AnalysisReportProps {
  insights: GeminiResponse;
  analyzedAt: Date;
}

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 20,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 12,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  verdictGrid: {
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
  },
  verdictItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  fundingTable: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    padding: 8,
  },
  headerCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
});

// PDF Document Component
const PitchDeckPDF = ({ insights, analyzedAt }: AnalysisReportProps) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Pitch Deck Analysis Report</Text>
      
      {/* Header Info */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.text}>
          Industry: {insights.industry_type}
        </Text>
        <Text style={pdfStyles.text}>
          Generated on: {format(analyzedAt, 'MMMM dd yyyy, HH:mm')}
        </Text>
      </View>

      {/* Initial Assessment */}
      <View style={[pdfStyles.section, { backgroundColor: '#f8f9fa' }]}>
        <Text style={pdfStyles.sectionTitle}>Initial Assessment</Text>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Pitch Clarity:</Text>
          <Text style={pdfStyles.value}>{insights.pitch_clarity}/10</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Investment Score:</Text>
          <Text style={pdfStyles.value}>{insights.investment_score}/10</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Market Position:</Text>
          <Text style={pdfStyles.value}>{insights.market_position}</Text>
        </View>
      </View>

      {/* Company Overview */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Company Overview</Text>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Company Name:</Text>
          <Text style={pdfStyles.value}>{insights.company_overview.company_name}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Business Model:</Text>
          <Text style={pdfStyles.value}>{insights.company_overview.business_model}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Founded:</Text>
          <Text style={pdfStyles.value}>{insights.company_overview.founded_on}</Text>
        </View>
      </View>

      {/* Funding History */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Funding History</Text>
        <View style={pdfStyles.fundingTable}>
          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.headerCell}>Round</Text>
            <Text style={pdfStyles.headerCell}>Amount</Text>
            <Text style={pdfStyles.headerCell}>Key Investors</Text>
          </View>
          {insights.funding_history.rounds.map((round, index) => (
            <View key={index} style={[pdfStyles.row, { borderBottomWidth: 1, borderBottomColor: '#eee' }]}>
              <Text style={pdfStyles.tableCell}>{round.type}</Text>
              <Text style={pdfStyles.tableCell}>{round.amount}</Text>
              <Text style={pdfStyles.tableCell}>{round.key_investors.join(', ')}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Final Verdict */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Final Verdict</Text>
        <View style={pdfStyles.verdictGrid}>
          <View style={pdfStyles.verdictItem}>
            <Text style={pdfStyles.label}>Product Viability</Text>
            <Text style={pdfStyles.value}>{insights.final_verdict.product_viability}/10</Text>
          </View>
          <View style={pdfStyles.verdictItem}>
            <Text style={pdfStyles.label}>Market Potential</Text>
            <Text style={pdfStyles.value}>{insights.final_verdict.market_potential}/10</Text>
          </View>
          <View style={pdfStyles.verdictItem}>
            <Text style={pdfStyles.label}>Sustainability</Text>
            <Text style={pdfStyles.value}>{insights.final_verdict.sustainability}/10</Text>
          </View>
          <View style={pdfStyles.verdictItem}>
            <Text style={pdfStyles.label}>Innovation</Text>
            <Text style={pdfStyles.value}>{insights.final_verdict.innovation}/10</Text>
          </View>
          <View style={pdfStyles.verdictItem}>
            <Text style={pdfStyles.label}>Exit Potential</Text>
            <Text style={pdfStyles.value}>{insights.final_verdict.exit_potential}/10</Text>
          </View>
          <View style={pdfStyles.verdictItem}>
            <Text style={pdfStyles.label}>Risk Factor</Text>
            <Text style={pdfStyles.value}>{insights.final_verdict.risk_factor}/10</Text>
          </View>
          <View style={pdfStyles.verdictItem}>
            <Text style={pdfStyles.label}>Competitive Edge</Text>
            <Text style={pdfStyles.value}>{insights.final_verdict.competitive_edge}/10</Text>
          </View>
        </View>
      </View>

      {/* Proposed Deal Structure */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Proposed Deal Structure</Text>
        <View style={[pdfStyles.verdictGrid, { backgroundColor: '#f0f7ff' }]}>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Investment Amount:</Text>
            <Text style={pdfStyles.value}>{insights.proposed_deal_structure.investment_amount}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Valuation Cap:</Text>
            <Text style={pdfStyles.value}>{insights.proposed_deal_structure.valuation_cap}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Equity Stake:</Text>
            <Text style={pdfStyles.value}>{insights.proposed_deal_structure.equity_stake}</Text>
          </View>
        </View>
      </View>

      {/* Strengths & Weaknesses */}
      <View style={[pdfStyles.section, { alignItems: 'center' }]}>
        <Text style={[pdfStyles.sectionTitle, { textAlign: 'center' }]}>Analysis</Text>
        <View style={{ width: '80%', alignSelf: 'center' }}>
          <Text style={[pdfStyles.text, { textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }]}>Strengths:</Text>
          {insights.strengths.map((strength, index) => (
            <Text key={index} style={[pdfStyles.text, { textAlign: 'center' }]}>• {strength}</Text>
          ))}
          <Text style={[pdfStyles.text, { textAlign: 'center', fontWeight: 'bold', marginTop: 15, marginBottom: 10 }]}>Weaknesses:</Text>
          {insights.weaknesses.map((weakness, index) => (
            <Text key={index} style={[pdfStyles.text, { textAlign: 'center' }]}>• {weakness}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

const AnalysisReport: React.FC<AnalysisReportProps> = ({ insights, analyzedAt }) => {
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Save to history when component mounts (analysis is complete)
    saveToHistory(insights);
  }, [insights]);

  if (showHistory) {
    return (
      <div>
        <button
          onClick={() => setShowHistory(false)}
          className="fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-10"
        >
          <FileText className="w-4 h-4" />
          Back to Analysis
        </button>
        <History />
      </div>
    );
  }

  return (
    <div className={styles.gradientWrapper}>
      <img
        src="/images/backgroundgradiant.png"
        alt="Gradient Background"
        className={styles.gradientBackground}
      />
      <div className={styles.innerBox}>
        <h1 className={`${styles.title} text-center mb-8`}>Analysis Report</h1>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white">
                {insights.industry_type} | Last updated: {format(analyzedAt, 'yyyy-MM-dd')}
              </h2>
              <div className="text-gray-400">
                <p className="text-sm">Date and Time</p>
                <p className="text-white text-lg mt-1">
                  {format(analyzedAt, 'MMMM dd yyyy')} at {format(analyzedAt, 'HH:mm')}
                </p>
              </div>
            </div>

            <div className="border-b border-gray-700 w-full"></div>

            {/* Metrics */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur text-white text-sm">
                <FileText className="w-4 h-4 text-white/80" />
                <span>Pitch Clarity: {insights.pitch_clarity}/10</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur text-white text-sm">
                <Globe className="w-4 h-4 text-white/80" />
                <span>Investment Score: {insights.investment_score}/10</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur text-white text-sm">
                <Globe className="w-4 h-4 text-white/80" />
                <span>Market Position: {insights.market_position}</span>
              </div>
            </div>

            {/* Company Overview */}
            <div className="space-y-4">
              <h3 className="text-white text-lg">Company Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-400">Company Name</p>
                  <p className="text-white">{insights.company_overview.company_name}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400">Industry</p>
                  <p className="text-white">{insights.company_overview.industry}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400">Business Model</p>
                  <p className="text-white">{insights.company_overview.business_model}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400">Key Offerings</p>
                  <p className="text-white">{insights.company_overview.key_offerings}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400">Market Position</p>
                  <p className="text-white">{insights.company_overview.market_position}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400">Founded</p>
                  <p className="text-white">{insights.company_overview.founded_on}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <h3 className="text-white text-lg mb-4">Performance Analysis</h3>
              <div className="h-[300px]">
                <RadarChart data={insights.final_verdict} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column */}
          <div>
            {/* Strengths & Weaknesses */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <h3 className="text-white text-lg mb-4">Strengths (Pros)</h3>
                  <div className="space-y-2 w-full">
                    {insights.strengths.slice(0, 4).map((strength, index) => (
                      <div key={index} className="bg-black/20 rounded-lg p-3">
                        <div className="flex gap-2 justify-center">
                          <span className="text-blue-400">{index + 1}</span>
                          <p className="text-gray-300">{strength}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-white text-lg mb-4">Weaknesses (Cons)</h3>
                  <div className="space-y-2 w-full">
                    {insights.weaknesses.slice(0, 4).map((weakness, index) => (
                      <div key={index} className="bg-black/20 rounded-lg p-3">
                        <div className="flex gap-2 justify-center">
                          <span className="text-blue-400">{index + 1}</span>
                          <p className="text-gray-300">{weakness}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Funding History */}
            <div className="mb-8">
              <h3 className="text-white text-lg mb-4">Funding History</h3>
              <div className="space-y-2">
                {insights.funding_history.rounds.map((round, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <p className="text-gray-400">{round.type}</p>
                    <p className="text-white">{round.amount}</p>
                    <p className="text-gray-300">{round.key_investors.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Expert Insights */}
            {/* <div className="mb-8">
              <h3 className="text-white text-lg mb-4">Expert Insights</h3>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-gray-300">{insights.key_insights}</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Proposed Deal Structure */}
        <div className="mb-8">
          <h3 className="text-white text-lg mb-4">Proposed Deal Structure</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-gray-400 mb-1">Investment Amount</p>
              <p className="text-white">{insights.proposed_deal_structure.investment_amount}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-gray-400 mb-1">Valuation Cap</p>
              <p className="text-white">{insights.proposed_deal_structure.valuation_cap}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-gray-400 mb-1">Equity Stake</p>
              <p className="text-white">{insights.proposed_deal_structure.equity_stake}</p>
            </div>
          </div>
        </div>

        {/* Key Questions */}
        <div className="mb-8">
          <h3 className="text-white text-lg mb-4">Key Questions for the Startup</h3>
          <div className="space-y-4">
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-gray-400 mb-2">Market Strategy</p>
              <p className="text-gray-300">{insights.key_questions.market_strategy[0]}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-gray-400 mb-2">User Relations</p>
              <p className="text-gray-300">{insights.key_questions.user_relation[0]}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-gray-400 mb-2">Regulatory Compliance</p>
              <p className="text-gray-300">{insights.key_questions.regulatory_compliance[0]}</p>
            </div>
          </div>
        </div>

        {/* Final Verdict */}
        <div>
          <h3 className="text-white text-lg mb-4">Final Verdict</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <p className="text-gray-400 mb-1">Product Viability</p>
              <p className="text-2xl font-bold text-blue-400">{insights.final_verdict.product_viability}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <p className="text-gray-400 mb-1">Market Potential</p>
              <p className="text-2xl font-bold text-blue-400">{insights.final_verdict.market_potential}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <p className="text-gray-400 mb-1">Sustainability</p>
              <p className="text-2xl font-bold text-blue-400">{insights.final_verdict.sustainability}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <p className="text-gray-400 mb-1">Innovation</p>
              <p className="text-2xl font-bold text-blue-400">{insights.final_verdict.innovation}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <p className="text-gray-400 mb-1">Exit Potential</p>
              <p className="text-2xl font-bold text-blue-400">{insights.final_verdict.exit_potential}</p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <div className="bg-black/20 rounded-lg p-4 text-center w-1/3">
              <p className="text-gray-400 mb-1">Risk Factor</p>
              <p className="text-2xl font-bold text-blue-400">{insights.final_verdict.risk_factor}</p>
            </div>
          </div>
        </div>

        {/* Download and History Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <PDFDownloadLink
            document={<PitchDeckPDF insights={insights} analyzedAt={analyzedAt} />}
            fileName={`pitch-deck-analysis-${format(analyzedAt, 'yyyy-MM-dd')}.pdf`}
          >
            {({ loading }) => (
              <button 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                disabled={loading}
              >
                <Download className="w-4 h-4" />
                {loading ? 'Preparing PDF...' : 'Download Analysis'}
              </button>
            )}
          </PDFDownloadLink>

          <button
            onClick={() => setShowHistory(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <HistoryIcon className="w-4 h-4" />
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport; 