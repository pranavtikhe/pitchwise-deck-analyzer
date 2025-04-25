  import React, { useEffect, useState } from "react";
  import { MistralResponse } from "../services/pdfService";
  import { format } from "date-fns";
  import styles from "@/styles/upload.module.scss";
  import {
    FileText,
    Globe,
    Download,
    History as HistoryIcon,
  } from "lucide-react";
  import {
    PDFDownloadLink,
    Document,
    Page,
    Text,
    View,
    StyleSheet,
  } from "@react-pdf/renderer";
  import { saveToHistory } from "@/services/historyService";
  import {
    Radar,
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
  } from 'recharts';
  import HistoryComponent from "@/pages/History";

  interface AnalysisReportProps {
    data?: MistralResponse & {
      analyzedAt: Date;
    };
  }

  // PDF Styles
  const pdfStyles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: "#FFFFFF",
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: "center",
      color: "#333",
    },
    section: {
      marginBottom: 20,
      padding: 10,
    },
    sectionTitle: {
      fontSize: 16,
      marginBottom: 10,
      color: "#333",
      fontWeight: "bold",
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
      color: "#666",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
    },
    label: {
      fontSize: 12,
      color: "#666",
      flex: 1,
    },
    value: {
      fontSize: 12,
      color: "#333",
      flex: 1,
      textAlign: "right",
    },
    verdictGrid: {
      marginTop: 10,
      backgroundColor: "#f8f9fa",
      padding: 15,
      borderRadius: 5,
    },
    verdictItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
      padding: 8,
      backgroundColor: "#fff",
      borderRadius: 4,
    },
    fundingTable: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: "#eee",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#f8f9fa",
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    tableCell: {
      flex: 1,
      fontSize: 11,
      padding: 8,
    },
    headerCell: {
      flex: 1,
      fontSize: 11,
      fontWeight: "bold",
      color: "#333",
    },
  });

  // PDF Document Component
  const PitchDeckPDF = ({ data }: AnalysisReportProps) => (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>Pitch Deck Analysis Report</Text>

        {/* Header Info */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>Industry: {data.industry_type}</Text>
          <Text style={pdfStyles.text}>
            {format(data.analyzedAt, "MMMM dd yyyy")} at{" "}
            {format(data.analyzedAt, "HH:mm")}
          </Text>
        </View>

        {/* Initial Assessment */}
        <View style={[pdfStyles.section, { backgroundColor: "#f8f9fa" }]}>
          <Text style={pdfStyles.sectionTitle}>Initial Assessment</Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Pitch Clarity:</Text>
            <Text style={pdfStyles.value}>{data.pitch_clarity}/10</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Investment Score:</Text>
            <Text style={pdfStyles.value}>{data.investment_score}/10</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Market Position:</Text>
            <Text style={pdfStyles.value}>{data.market_position}</Text>
          </View>
        </View>

        {/* Company Overview */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Company Overview</Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Company Name:</Text>
            <Text style={pdfStyles.value}>
              {data.company_overview.company_name}
            </Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Business Model:</Text>
            <Text style={pdfStyles.value}>
              {data.company_overview.business_model}
            </Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Founded:</Text>
            <Text style={pdfStyles.value}>
              {data.company_overview.founded_on}
            </Text>
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
            {data.funding_history.rounds.map((round, index) => (
              <View
                key={index}
                style={[
                  pdfStyles.row,
                  { borderBottomWidth: 1, borderBottomColor: "#eee" },
                ]}
              >
                <Text style={pdfStyles.tableCell}>{round.type}</Text>
                <Text style={pdfStyles.tableCell}>{round.amount}</Text>
                <Text style={pdfStyles.tableCell}>
                  {Array.isArray(round.key_investors) ? round.key_investors.join(", ") : (round.key_investors || 'Not specified')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Strengths and Weaknesses */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Analysis</Text>
          <View style={{ width: "80%", alignSelf: "center" }}>
            <Text
              style={[
                pdfStyles.text,
                { textAlign: "center", fontWeight: "bold", marginBottom: 10 },
              ]}
            >
              Strengths:
            </Text>
            {data.strengths.map((strength, index) => (
              <Text key={index} style={[pdfStyles.text, { textAlign: "center" }]}>
                • {strength}
              </Text>
            ))}
            <Text
              style={[
                pdfStyles.text,
                {
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 15,
                  marginBottom: 10,
                },
              ]}
            >
              Weaknesses:
            </Text>
            {data.weaknesses.map((weakness, index) => (
              <Text key={index} style={[pdfStyles.text, { textAlign: "center" }]}>
                • {weakness}
              </Text>
            ))}
          </View>
        </View>

        {/* Expert Opinions */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Expert Opinions</Text>
          {data.expert_opinions.map((opinion, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={[pdfStyles.text, { fontWeight: 'bold' }]}>
                {opinion.name} - {opinion.affiliation}
              </Text>
              <Text style={pdfStyles.text}>{opinion.summary}</Text>
              <Text style={[pdfStyles.text, { fontSize: 10, color: '#666' }]}>
                Reference: {opinion.reference} | Date: {opinion.date}
              </Text>
            </View>
          ))}
        </View>

        {/* Final Verdict */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Final Verdict</Text>
          <View style={pdfStyles.verdictGrid}>
            <View style={pdfStyles.verdictItem}>
              <Text style={pdfStyles.label}>Product Viability</Text>
              <Text style={pdfStyles.value}>
                {data.final_verdict.product_viability}/10
              </Text>
            </View>
            <View style={pdfStyles.verdictItem}>
              <Text style={pdfStyles.label}>Market Potential</Text>
              <Text style={pdfStyles.value}>
                {data.final_verdict.market_potential}/10
              </Text>
            </View>
            <View style={pdfStyles.verdictItem}>
              <Text style={pdfStyles.label}>Sustainability</Text>
              <Text style={pdfStyles.value}>
                {data.final_verdict.sustainability}/10
              </Text>
            </View>
            <View style={pdfStyles.verdictItem}>
              <Text style={pdfStyles.label}>Innovation</Text>
              <Text style={pdfStyles.value}>
                {data.final_verdict.innovation}/10
              </Text>
            </View>
            <View style={pdfStyles.verdictItem}>
              <Text style={pdfStyles.label}>Exit Potential</Text>
              <Text style={pdfStyles.value}>
                {data.final_verdict.exit_potential}/10
              </Text>
            </View>
            <View style={pdfStyles.verdictItem}>
              <Text style={pdfStyles.label}>Risk Factor</Text>
              <Text style={pdfStyles.value}>
                {data.final_verdict.risk_factor}/10
              </Text>
            </View>
            <View style={pdfStyles.verdictItem}>
              <Text style={pdfStyles.label}>Competitive Edge</Text>
              <Text style={pdfStyles.value}>
                {data.final_verdict.competitive_edge}/10
              </Text>
            </View>
          </View>
        </View>

        {/* Proposed Deal Structure */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Proposed Deal Structure</Text>
          <View style={[pdfStyles.verdictGrid, { backgroundColor: "#f0f7ff" }]}>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Investment Amount:</Text>
              <Text style={pdfStyles.value}>
                {data.proposed_deal_structure.investment_amount}
              </Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Valuation Cap:</Text>
              <Text style={pdfStyles.value}>
                {data.proposed_deal_structure.valuation_cap}
              </Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Equity Stake:</Text>
              <Text style={pdfStyles.value}>
                {data.proposed_deal_structure.equity_stake}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  type Competitor = {
    name: string;
    marketShare: string;
    keyInvestors: string;
    growthRate: string;
    keyDifferentiator: string;
  };

  const AnalysisReport: React.FC<AnalysisReportProps> = ({ data }) => {
    const [showHistory, setShowHistory] = useState(false);

    // Prepare data for radar chart
    const chartData = [
      { subject: 'Product Viability', value: data.final_verdict.product_viability },
      { subject: 'Financial Health', value: data.final_verdict.product_viability },
      { subject: 'Market Potential', value: data.final_verdict.market_potential },
      { subject: 'Sustainability', value: data.final_verdict.sustainability },
      { subject: 'Innovation', value: data.final_verdict.innovation },
      { subject: 'Exit Potential', value: data.final_verdict.exit_potential },
      { subject: 'Risk Factors', value: data.final_verdict.risk_factor },
      { subject: 'Customer Traction', value: data.final_verdict.market_potential },
      { subject: 'Competitive Edge', value: data.final_verdict.competitive_edge },
      { subject: 'Team Strength', value: data.final_verdict.innovation }
    ];

    useEffect(() => {
      // Save to history when component mounts (analysis is complete)
      if (data) {
        saveToHistory(data);
      }
    }, [data]);

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
          <HistoryComponent />
        </div>
      );
    }

    // Handle loading state
    if (!data) {
      return (
        <div className={`${styles.gradientWrapper} font-fustat`}>
          <img
            src="/images/backgroundgradiant.png"
            alt="Gradient Background"
            className={styles.gradientBackground}
          />
          <div className={styles.innerBox}>
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading analysis report...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="flex justify-end mb-6 mr-6">
          <button 
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
            onClick={() => window.location.href = '/spider'}
          >
            Generate New Report
          </button>
        </div>

        <div className={`${styles.gradientWrapper} font-fustat`}>
          <img
            src="/images/backgroundgradiant.png"
            alt="Gradient Background"
            className={styles.gradientBackground}
          />
          <div className={styles.innerBox}>
            {/* Type and Date */}
            <div className="mb-8">
              <h2 className="text-[40px] font-medium text-white mb-2">
                {data.industry_type}
              </h2>
              <p className="text-gray-400">
                {format(data.analyzedAt, "MMMM dd yyyy")} at{" "}
                {format(data.analyzedAt, "HH:mm")}
              </p>
            </div>

            {/* Company Overview Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-12 text-white text-left">Company Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6 relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-700"></div>
                {[
                  {
                    label: "Company Name",
                    value: data.company_overview.company_name,
                  },
                  {
                    label: "Key Offerings",
                    value: data.company_overview.key_offerings,
                  },
                  { label: "Industry", value: data.company_overview.industry },
                  {
                    label: "Market Position",
                    value: data.company_overview.market_position,
                  },
                  {
                    label: "Business Model",
                    value: data.company_overview.business_model,
                  },
                  { label: "Founded", value: data.company_overview.founded_on },
                ].map((item, index) => (
                  <div key={index} className="border-b border-gray-700 p-4">
                    <div className="flex justify-between">
                      <p className="text-gray-400 mr-2">{item.label}</p>
                      <p className="text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-12 text-white text-left">Pros & Cons</h2>

              <div className="grid grid-cols-2 justify-center gap-12 mb-12 mt-12 relative">
                {/* Vertical divider */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-700 -mx-3"></div>

                <div>
                  <h4 className="text-white mb-4 text-left">Strengths (Pros)</h4>
                  <div className="space-y-6">
                    {data.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center mr-4">
                          <span className="text-white text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-300 pt-1">{strength}</p>
                      </div>
                    ))}
                    {/* Add placeholder strengths if needed to match weaknesses */}
                    {data.strengths.length < data.weaknesses.length &&
                      Array(data.weaknesses.length - data.strengths.length).fill(null).map((_, index) => (
                        <div key={`placeholder-${index}`} className="flex items-start">
                          <div className="flex-shrink-0 rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center mr-4">
                            <span className="text-white text-sm">{data.strengths.length + index + 1}</span>
                          </div>
                          <p className="text-gray-300 pt-1">Additional strength analysis pending</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div>
                  <h4 className="text-white mb-4 text-left ">Weaknesses (Cons)</h4>
                  <div className="space-y-6">
                    {data.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center mr-4">
                          <span className="text-white text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-300 pt-1">{weakness}</p>
                      </div>
                    ))}
                    {/* Add placeholder weaknesses if needed to match strengths */}
                    {data.weaknesses.length < data.strengths.length &&
                      Array(data.strengths.length - data.weaknesses.length).fill(null).map((_, index) => (
                        <div key={`placeholder-${index}`} className="flex items-start">
                          <div className="flex-shrink-0 rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center mr-4">
                            <span className="text-white text-sm">{data.weaknesses.length + index + 1}</span>
                          </div>
                          <p className="text-gray-300 pt-1">Additional weakness analysis pending</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>

              {/* Competitive Competitors */}
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-12 mt-20 text-left">Competitor Comparison</h2>
                <div className="grid gap-0 border-b border-gray-700" style={{ gridTemplateColumns: `minmax(150px, 1.5fr) repeat(${data.competitor_analysis.competitors.length}, minmax(120px, 1fr))` }}>
                  <div className="p-4 font-bold">Competitors</div>
                  {data.competitor_analysis.competitors.map((competitor, index) => (
                    <div key={index} className={`p-4 text-center ${index < data.competitor_analysis.competitors.length - 1 ? 'border-r border-gray-700' : ''}`}>
                      {competitor.name}
                    </div>
                  ))}
                </div>
                <div className="grid gap-0" style={{ gridTemplateColumns: `minmax(150px, 1.5fr) repeat(${data.competitor_analysis.competitors.length}, minmax(120px, 1fr))` }}>
                  <div className="p-4 font-bold">Key Investors</div>
                  {data.competitor_analysis.competitors.map((competitor, index) => (
                    <div key={index} className={`p-4 text-center ${index < data.competitor_analysis.competitors.length - 1 ? 'border-r border-gray-700' : ''}`}>
                      {Array.isArray(competitor.key_investors) ? competitor.key_investors.join(", ") : (competitor.key_investors || 'Not specified')}
                    </div>
                  ))}
                </div>
                <div className="grid gap-0" style={{ gridTemplateColumns: `minmax(150px, 1.5fr) repeat(${data.competitor_analysis.competitors.length}, minmax(120px, 1fr))` }}>
                  <div className="p-4 font-bold">Amount Raised</div>
                  {data.competitor_analysis.competitors.map((competitor, index) => (
                    <div key={index} className={`p-4 text-center ${index < data.competitor_analysis.competitors.length - 1 ? 'border-r border-gray-700' : ''}`}>
                      {competitor.amount_raised}
                    </div>
                  ))}
                </div>
                <div className="grid gap-0" style={{ gridTemplateColumns: `minmax(150px, 1.5fr) repeat(${data.competitor_analysis.competitors.length}, minmax(120px, 1fr))` }}>
                  <div className="p-4 font-bold">Market Position</div>
                  {data.competitor_analysis.competitors.map((competitor, index) => (
                    <div key={index} className={`p-4 text-center ${index < data.competitor_analysis.competitors.length - 1 ? 'border-r border-gray-700' : ''}`}>
                      {competitor.market_position}
                    </div>
                  ))}
                </div>
                <div className="grid gap-0" style={{ gridTemplateColumns: `minmax(150px, 1.5fr) repeat(${data.competitor_analysis.competitors.length}, minmax(120px, 1fr))` }}>
                  <div className="p-4 font-bold">Strengths</div>
                  {data.competitor_analysis.competitors.map((competitor, index) => (
                    <div key={index} className={`p-4 text-center ${index < data.competitor_analysis.competitors.length - 1 ? 'border-r border-gray-700' : ''}`}>
                      {competitor.strengths}
                    </div>
                  ))}
                </div>
              </div>

              {/* To Date Funds Raised */}
              <div className="text-white mt-12 mb-12">
                <h2 className="text-2xl font-bold mb-12 text-left">To Date Funds Raised</h2>
                {data.funding_history?.rounds?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.funding_history.rounds.map((round, index) => (
                      <div key={index} className="rounded-xl p-4 shadow-lg border border-gray-700 backdrop-blur-sm">
                        <h3 className="text-lg mb-4 text-white font-semibold">{round.type}</h3>

                        <div className="space-y-4">
                          <div className="bg-[#F8F8F8]/[0.03] rounded-lg p-4">
                            <p className="text-gray-400 text-sm mb-1">Amount Raised</p>
                            <p className="text-white text-xl font-semibold">{round.amount}</p>
                          </div>

                          <div className="bg-[#F8F8F8]/[0.03] rounded-lg p-4">
                            <p className="text-gray-400 text-sm mb-1">Key Investors</p>
                            <p className="text-white">{Array.isArray(round.key_investors) ? round.key_investors.join(", ") : (round.key_investors || 'Not specified')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl p-8 shadow-lg border border-gray-700 backdrop-blur-sm text-center">
                    <p className="text-gray-400 text-lg">Not Available in Deck</p>
                  </div>
                )}
              </div>

              {/* table of findings */}
              <div className="mt-12 mb-12">
                <h2 className="text-2xl font-bold mb-12 text-white text-left">Summary Table of Findings</h2>
                <div className="grid grid-cols-2 gap-6">
                  {data.competitor_analysis.competitors.map((competitor) => (
                    <div
                      key={competitor.name}
                      className="rounded-xl overflow-hidden backdrop-blur-sm"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-6">{competitor.name}</h3>
                        <div className="space-y-4">
                          <div className="border-b border-gray-700 pb-4 text-left">
                            <p className="text-gray-400 text-sm mb-1">Market Share</p>
                            <p className="text-white">{competitor.market_position}</p>
                          </div>
                          <div className="border-b border-gray-700 pb-4 text-left">
                            <p className="text-gray-400 text-sm mb-1">Key Investors</p>
                            <p className="text-white">{Array.isArray(competitor.key_investors) ? competitor.key_investors.join(", ") : (competitor.key_investors || 'Not specified')}</p>
                          </div>
                          <div className="border-b border-gray-700 pb-4 text-left">
                            <p className="text-gray-400 text-sm mb-1">Growth Rate</p>
                            <p className="text-white">{competitor.amount_raised}</p>
                          </div>
                          <div className="pb-2 text-left">
                            <p className="text-gray-400 text-sm mb-1">Key Differentiator</p>
                            <p className="text-white">{competitor.strengths}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* expert opinions */}
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-12 mt-12 text-left">
                  Industry Expert Opinions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.expert_opinions?.map((opinion, index) => (
                    <div key={index} className="rounded-xl p-4 shadow-lg border border-gray-700 backdrop-blur-sm flex flex-col h-full">
                      <h3 className="text-lg mb-4 text-white font-semibold">{opinion.name}</h3>

                      <div className="bg-[#F8F8F8]/[0.03] rounded-lg p-4 mb-4">
                        <p className="text-gray-400 text-sm mb-1">Affiliation</p>
                        <p className="text-white break-words">{opinion.affiliation}</p>
                      </div>

                      <div className="bg-[#F8F8F8]/[0.03] rounded-lg p-4 mb-4 flex-grow">
                        <p className="text-gray-400 text-sm mb-1">Opinion Summary</p>
                        <p className="text-white break-words">{opinion.summary}</p>
                      </div>

                      <div className="bg-[#F8F8F8]/[0.03] rounded-lg p-4 mb-4">
                        <p className="text-gray-400 text-sm mb-1">Reference</p>
                        <p className="text-white break-words overflow-hidden">{opinion.reference}</p>
                      </div>

                      <div className="bg-[#F8F8F8]/[0.03] rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Date</p>
                        <p className="text-white">{opinion.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* conclusion */}
              <div className="text-white ">
                <h2 className="text-2xl font-bold mb-12 mt-12 text-left">Expert Conclusion</h2>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-600 pb-4">
                    <p className="text-gray-400">Product Viability</p>
                    <p>{data.final_verdict.product_viability}</p>
                  </div>
                  <div className="flex justify-between border-b border-gray-600 pb-4">
                    <p className="text-gray-400">Market Potential</p>
                    <p>{data.final_verdict.market_potential}</p>
                  </div>
                  <div className="flex justify-between border-b border-gray-600 pb-4">
                    <p className="text-gray-400">Sustainability</p>
                    <p>{data.final_verdict.sustainability}</p>
                  </div>
                  <div className="flex justify-between border-b border-gray-600 pb-4">
                    <p className="text-gray-400">Innovation</p>
                    <p>{data.final_verdict.innovation}</p>
                  </div>
                  <div className="flex justify-between border-b border-gray-600 pb-4">
                    <p className="text-gray-400">Exit Potential</p>
                    <p>{data.final_verdict.exit_potential}</p>
                  </div>
                  <div className="flex justify-between border-b border-gray-600 pb-4">
                    <p className="text-gray-400">Risk Factors</p>
                    <p>{data.final_verdict.risk_factor}</p>
                  </div>
                  <div className="flex justify-between border-b border-gray-600 pb-4">
                    <p className="text-gray-400">Competitive Edge</p>
                    <p>{data.final_verdict.competitive_edge}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* final verdict */}
          <div className="flex flex-col gap-8 mt-2">
            <div className={styles.innerBox}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-white text-lg mb-6">Performance Analysis</h3>
                  <div className="h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsRadarChart
                        data={chartData}
                        outerRadius={180}
                        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
                      >
                        <defs>
                          <radialGradient id="radarGradient">
                            <stop offset="28%" stopColor="#29272C" />
                            <stop offset="65%" stopColor="#B0B0B0" />
                            <stop offset="100%" stopColor="#FFFFFF" />
                          </radialGradient>
                        </defs>
                        <PolarGrid
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeDasharray="3 3"
                        />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: '#9CA3AF', fontSize: 14 }}
                        />
                        <Radar
                          name="Performance"
                          dataKey="value"
                          stroke="#B0B0B0"
                          fill="url(#radarGradient)"
                          fillOpacity={0.28}
                          dot={false}
                        />
                      </RechartsRadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex-1 text-white p-6">
                  <h2 className="text-3xl font-bold mb-6">Final Verdict</h2>
                  <p className="text-gray-300 mb-6">
                    {data.company_overview.company_name} shows significant potential
                    in the {data.industry_type} market with a well-planned approach
                    to tap into the market opportunities.
                  </p>
                  <div className="grid grid-cols-2 gap-px ">
                    <div className="p-4 ">
                      <p className="text-3xl font-bold">
                        {data.final_verdict.product_viability}
                      </p>
                      <p className="text-gray-400">Product Viability</p>
                    </div>
                    <div className="p-4 ">
                      <p className="text-3xl font-bold">
                        {data.final_verdict.market_potential}
                      </p>
                      <p className="text-gray-400">Market Potential</p>
                    </div>
                    <div className="p-4 ">
                      <p className="text-3xl font-bold">
                        {data.final_verdict.sustainability}
                      </p>
                      <p className="text-gray-400">Sustainability</p>
                    </div>
                    <div className="p-4 ">
                      <p className="text-3xl font-bold">
                        {data.final_verdict.exit_potential}
                      </p>
                      <p className="text-gray-400">Exit Potential</p>
                    </div>
                    <div className="p-4 ">
                      <p className="text-3xl font-bold">
                        {data.final_verdict.risk_factor}
                      </p>
                      <p className="text-gray-400">Risk Factors</p>
                    </div>
                    <div className="p-4 ">
                      <p className="text-3xl font-bold">
                        {data.final_verdict.innovation}
                      </p>
                      <p className="text-gray-400">Innovation</p>
                    </div>
                    <div className="p-4 ">
                      <p className="text-3xl font-bold">
                        {data.final_verdict.competitive_edge}
                      </p>
                      <p className="text-gray-400">Competitive Edge</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <PDFDownloadLink
                  document={<PitchDeckPDF data={data} />}
                  fileName={`${data.company_overview.company_name}_analysis.pdf`}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  {({ loading }) => (
                    <>
                      <Download className="w-5 h-5" />
                      {loading ? 'Preparing PDF...' : 'Download Analysis'}
                    </>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default AnalysisReport;
