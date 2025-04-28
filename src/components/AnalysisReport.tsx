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
} from "recharts";
import { Star } from "lucide-react";

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
                {round.key_investors.join(", ")}
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
            <Text style={[pdfStyles.text, { fontWeight: "bold" }]}>
              {opinion.name} - {opinion.affiliation}
            </Text>
            <Text style={pdfStyles.text}>{opinion.summary}</Text>
            <Text style={[pdfStyles.text, { fontSize: 10, color: "#666" }]}>
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
    {
      subject: "Product Viability",
      value: data.final_verdict.product_viability,
    },
    {
      subject: "Financial Health",
      value: data.final_verdict.product_viability,
    },
    { subject: "Market Potential", value: data.final_verdict.market_potential },
    { subject: "Sustainability", value: data.final_verdict.sustainability },
    { subject: "Innovation", value: data.final_verdict.innovation },
    { subject: "Exit Potential", value: data.final_verdict.exit_potential },
    { subject: "Risk Factors", value: data.final_verdict.risk_factor },
    {
      subject: "Customer Traction",
      value: data.final_verdict.market_potential,
    },
    { subject: "Competitive Edge", value: data.final_verdict.competitive_edge },
    { subject: "Team Strength", value: data.final_verdict.innovation },
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
        <div className="history-view">
          {/* Add history view implementation here */}
          <p className="text-center text-gray-400">
            History view coming soon...
          </p>
        </div>
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
    <div className={`${styles.gradientWrapper} font-fustat`}>
      <img
        src="/images/backgroundgradiant.png"
        alt="Gradient Background"
        className={styles.gradientBackground}
      />
      <div className={styles.innerBox}>
        <div className="flex flex-col items-start mb-4">
          <h4 className="text-xl font-medium text-white">Analysis For: {data.company_overview.company_name}</h4>
          <p className="text-gray-400 text-sm mt-1">Industry: {data.industry_type} | Date: {format(data.analyzedAt, "MMMM dd yyyy")}</p>
        </div>
        <div className="bg-[#212228] bg-opacity-50 backdrop-blur-md rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Pitch Analysis Card */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
              <div className="flex items-center mb-4">
                <FileText className="text-teal-500 w-5 h-5 mr-3" />
                <h3 className="text-white text-lg font-medium">
                  Pitch Analysis
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Clarity Score:</p>
                  <p className="text-white text-2xl font-bold">
                    {data.pitch_clarity}/10
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Sentiment:</p>
                  <p className={`text-${data.reputation_analysis?.overall?.sentiment?.toLowerCase() === 'positive' ? 'green' : data.reputation_analysis?.overall?.sentiment?.toLowerCase() === 'negative' ? 'red' : 'yellow'}-500 font-medium`}>
                    {data.reputation_analysis?.overall?.sentiment || 'Neutral'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#ffffff1a]">
                  <p className="text-sm text-gray-300">
                    AI detected{" "}
                    <span className="font-medium">
                      {data.strengths?.length || 0} strengths
                    </span>{" "}
                    and{" "}
                    <span className="font-medium">
                      {data.weaknesses?.length || 0} potential issues
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Investment Potential Card */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
              <div className="flex items-center mb-4">
                <FileText className="text-teal-500 w-5 h-5 mr-3" />
                <h3 className="text-white text-lg font-medium">
                  Investment Potential
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Score:</p>
                  <p className="text-white text-2xl font-bold">
                    {data.investment_score}/10
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Exit Potential:</p>
                  <p className="text-white font-medium">
                    {data.proposed_deal_structure?.valuation_cap || 'Not specified'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#ffffff1a]">
                  <p className="text-sm text-gray-300">
                    {data.market_analysis?.growth_rate ? (
                      <>
                        Growth rate:{" "}
                        <span className="font-medium">
                          {data.market_analysis.growth_rate}
                        </span>
                        {" "}with{" "}
                        <span className="font-medium">
                          {data.final_verdict.risk_factor >= 7 ? 'high' : data.final_verdict.risk_factor >= 4 ? 'moderate' : 'low'} risk factors
                        </span>
                      </>
                    ) : (
                      "Market analysis data not available"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Market Position Card */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
              <div className="flex items-center mb-4">
                <FileText className="text-teal-500 w-5 h-5 mr-3" />
                <h3 className="text-white text-lg font-medium">
                  Market Position
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Classification:</p>
                  <p className="text-white text-2xl font-bold">
                    {data.market_position}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Industry:</p>
                  <p className="text-gray-300 font-medium">
                    {data.industry_type}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#ffffff1a]">
                  <p className="text-sm text-gray-300">
                    {data.competitor_analysis?.competitors ? (
                      <>
                        Competing with{" "}
                        <span className="font-medium">
                          {data.competitor_analysis.competitors.length}{" "}
                          established players
                        </span>
                      </>
                    ) : (
                      "Competitor data not available"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mt-8">
              <h2 className="text-2xl font-medium text-white mb-8">
                Company Overview
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="border-b border-[#ffffff1a] pb-4">
                  <p className="text-gray-400 text-sm mb-1">Company Name</p>
                  <p className="text-white text-base">
                    {data.company_overview.company_name}
                  </p>
                </div>

                <div className="border-b border-[#ffffff1a] pb-4">
                  <p className="text-gray-400 text-sm mb-1">Industry</p>
                  <p className="text-white text-base">
                    {data.company_overview.industry}
                  </p>
                </div>

                <div className="border-b border-[#ffffff1a] pb-4">
                  <p className="text-gray-400 text-sm mb-1">Market Position</p>
                  <p className="text-white text-base">
                    {data.company_overview.market_position}
                  </p>
                </div>

                <div className="border-b border-[#ffffff1a] pb-4">
                  <p className="text-gray-400 text-sm mb-1">Founded</p>
                  <p className="text-white text-base">
                    {data.company_overview.founded_on || "N/A"}
                  </p>
                </div>

                <div className="border-b border-[#ffffff1a] pb-4">
                  <p className="text-gray-400 text-sm mb-1">Business Model</p>
                  <p className="text-white text-base">
                    {data.company_overview.business_model}
                  </p>
                </div>

                <div className="border-b border-[#ffffff1a] pb-4">
                  <p className="text-gray-400 text-sm mb-1">Key Offerings</p>
                  <p className="text-white text-base">
                    {data.company_overview.key_offerings}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            {/* Strengths & Weaknesses Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-8">
              <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
                <h2 className="text-2xl font-medium text-white mb-6">
                  Strengths & Weaknesses
                </h2>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-green-500 text-lg mb-4">
                      Strengths (Pros)
                    </h3>
                    <ul className="space-y-3">
                      {data.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-400 mr-2 flex-shrink-0">
                            •
                          </span>
                          <span className="text-gray-300 text-sm leading-relaxed">
                            {strength}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-red-500 text-lg mb-4">
                      Weaknesses (Cons)
                    </h3>
                    <ul className="space-y-2">
                      {data.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-gray-400 mt-1 flex-shrink-0">
                            •
                          </span>
                          <span className="text-gray-300 text-sm leading-relaxed">
                            {weakness}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Funding History Section */}
              <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
                <h2 className="text-2xl font-medium text-white mb-6">
                  Funding History
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#ffffff1a]">
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">
                          Round
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">
                          Key Investors
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.funding_history.rounds.length > 0 ? (
                        data.funding_history.rounds.map((round, index) => (
                          <tr
                            key={index}
                            className="border-b border-[#ffffff1a]"
                          >
                            <td className="py-3 px-4 text-white text-left">
                              {round.type}
                            </td>
                            <td className="py-3 px-4 text-white text-left">
                              {round.amount}
                            </td>
                            <td className="py-3 px-4 text-white text-left">
                              {Array.isArray(round.key_investors)
                                ? round.key_investors.join(", ")
                                : round.key_investors}
                            </td>
                            <td className="py-3 px-4 text-white text-left">N/A</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-4 text-center text-gray-500"
                          >
                            No funding history available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div>
            {/* Competitor Comparison Section */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-medium text-white mb-6">
                Competitor Comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#ffffff1a]">
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">
                        Competitor
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">
                        Key Investors
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">
                        Amount Raised
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">
                        Market Position
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">
                        Strengths
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.competitor_analysis.competitors.map(
                      (competitor, index) => (
                        <tr key={index} className="border-b border-[#ffffff1a]">
                          <td className="py-4 px-4 text-white text-left">
                            {competitor.name}
                          </td>
                          <td className="py-4 px-4 text-white text-left">
                            {competitor.key_investors}
                          </td>
                          <td className="py-4 px-4 text-white text-left">
                            {competitor.amount_raised}
                          </td>
                          <td className="py-4 px-4 text-white text-left">
                            {competitor.market_position}
                          </td>
                          <td className="py-4 px-4 text-white text-left">
                            {competitor.strengths}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Market Comparison Section */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-medium text-white mb-6">
                Market Comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#ffffff1a]">
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">
                        Metric
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">
                        {data.company_overview.company_name}
                      </th>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <th
                            key={index}
                            className="text-left py-3 px-4 text-gray-400 font-normal"
                          >
                            {competitor.name}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#ffffff1a]">
                      <td className="py-4 px-4 text-gray-400 text-left">Market Share</td>
                      <td className="py-4 px-4 text-white text-left">
                        {data.market_position}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td key={index} className="py-4 px-4 text-white text-left">
                            {competitor.market_position}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-[#ffffff1a]">
                      <td className="py-4 px-4 text-gray-400 text-left">Growth Rate</td>
                      <td className="py-4 px-4 text-white text-left">
                        {data.market_analysis.growth_rate}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td key={index} className="py-4 px-4 text-white text-left">
                            {competitor.growth_rate || "N/A"}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-[#ffffff1a]">
                      <td className="py-4 px-4 text-gray-400 text-left">Revenue Model</td>
                      <td className="py-4 px-4 text-white text-left">
                        {data.company_overview.business_model}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td key={index} className="py-4 px-4 text-white text-left">
                            {competitor.business_model || "N/A"}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-[#ffffff1a]">
                      <td className="py-4 px-4 text-gray-400 text-left">Key Differentiator</td>
                      <td className="py-4 px-4 text-white text-left">
                        {data.strengths[0] || "N/A"}
                      </td>
                      {data.competitor_analysis.competitors
                        .slice(0, 4)
                        .map((competitor, index) => (
                          <td key={index} className="py-4 px-4 text-white text-left">
                            {competitor.key_differentiator || "N/A"}
                          </td>
                        ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exit Potential Section */}
            <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6">
              <h2 className="text-2xl font-medium text-white mb-6">
                Exit Potential
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1a1b1f] rounded-xl p-6">
                  <h3 className="text-gray-400 mb-4">Exit Likelihood</h3>
                  <div className="relative pt-2">
                    <div className="relative pt-2">
                      <div className="w-full bg-gray-700 rounded-full h-2 relative">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (data.final_verdict.exit_potential / 10) * 100
                            }%`,
                          }}
                        ></div>
                        <div className="absolute -top-10 right-0 bg-purple-900 text-purple-300 px-2 py-1 rounded text-sm">
                          {data.final_verdict.exit_potential}/10
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#1a1b1f] rounded-xl p-6">
                  <h3 className="text-gray-400 mb-4">Potential Exit Value</h3>
                  <p className="text-3xl font-semibold text-white">
                    {data.proposed_deal_structure?.valuation_cap || "Not disclosed"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expert Insights Section */}
          <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-medium text-white mb-6">
              Expert Insights
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expert Opinions Card */}
              <div className="bg-[#1a1b1f] rounded-xl p-6">
                <h3 className="text-xl text-white mb-4">Expert Opinion</h3>
                {data.expert_opinions && data.expert_opinions.length > 0 ? (
                  <div className="mb-6">
                    <h4 className="text-white text-lg font-medium">
                      {data.expert_opinions[0].name}
                    </h4>
                    <p className="text-gray-400 mb-2">
                      {data.expert_opinions[0].affiliation}
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-2">
                      {data.expert_opinions[0].summary}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Reference: {data.expert_opinions[0].reference} | Date: {data.expert_opinions[0].date}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-gray-400 text-lg font-medium mb-2">
                      No Expert Opinion Available
                    </h4>
                    <p className="text-gray-500 text-sm">
                      No expert opinions were found for this analysis.
                    </p>
                  </div>
                )}
              </div>

              {/* Reputation Analysis Card */}
              <div className="bg-[#1a1b1f] rounded-xl p-6">
                <h3 className="text-xl text-white mb-6">Reputation Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-[#ffffff1a]">
                        <td className="py-3 font-semibold text-gray-400">
                          News/Media
                        </td>
                        <td className="py-3 text-white">
                          {data.expert_insights?.reputation_analysis
                            ?.news_media || "N/A"}
                          /10
                        </td>
                        <td className="py-3 flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i <
                                Math.floor(
                                  (data.expert_insights?.reputation_analysis
                                    ?.news_media || 0) / 2
                                )
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </td>
                      </tr>
                      <tr className="border-b border-[#ffffff1a]">
                        <td className="py-3 font-semibold text-gray-400">
                          Social Media
                        </td>
                        <td className="py-3 text-white">
                          {data.expert_insights?.reputation_analysis
                            ?.social_media || "N/A"}
                          /10
                        </td>
                        <td className="py-3 flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i <
                                Math.floor(
                                  (data.expert_insights?.reputation_analysis
                                    ?.social_media || 0) / 2
                                )
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </td>
                      </tr>
                      <tr className="border-b border-[#ffffff1a]">
                        <td className="py-3 font-semibold text-gray-400">
                          Investor Reviews
                        </td>
                        <td className="py-3 text-white">
                          {data.expert_insights?.reputation_analysis
                            ?.investor_reviews || "N/A"}
                          /10
                        </td>
                        <td className="py-3 flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i <
                                Math.floor(
                                  (data.expert_insights?.reputation_analysis
                                    ?.investor_reviews || 0) / 2
                                )
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </td>
                      </tr>
                      <tr className="border-b border-[#ffffff1a]">
                        <td className="py-3 font-semibold text-gray-400">
                          Customer Feedback
                        </td>
                        <td className="py-3 text-white">
                          {data.expert_insights?.reputation_analysis
                            ?.customer_feedback || "N/A"}
                          /10
                        </td>
                        <td className="py-3 flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i <
                                Math.floor(
                                  (data.expert_insights?.reputation_analysis
                                    ?.customer_feedback || 0) / 2
                                )
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-gray-400">
                          Overall
                        </td>
                        <td className="py-3 text-white font-semibold">
                          {data.expert_insights?.reputation_analysis?.overall ||
                            "N/A"}
                          /10
                        </td>
                        <td className="py-3 flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i <
                                Math.floor(
                                  (data.expert_insights?.reputation_analysis
                                    ?.overall || 0) / 2
                                )
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Proposed Deal Structure */}
          <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-medium text-white mb-6">
              Proposed Deal Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deal Term Cards */}
              <div className="bg-[#1a1b1f] rounded-xl p-6">
                <h3 className="text-gray-400 text-base mb-2">
                  Investment Amount
                </h3>
                <p className="text-white text-2xl">
                  {data.proposed_deal_structure.investment_amount ? (
                    data.proposed_deal_structure.investment_amount
                  ) : (
                    <span className="text-xs text-gray-500">Not disclosed</span>
                  )}
                </p>
              </div>

              <div className="bg-[#1a1b1f] rounded-xl p-6">
                <h3 className="text-gray-400 text-base mb-2">Equity Stake</h3>
                <p className="text-white text-2xl">
                  {data.proposed_deal_structure.equity_stake ? (
                    data.proposed_deal_structure.equity_stake
                  ) : (
                    <span className="text-xs text-gray-500">Not disclosed</span>
                  )}
                </p>
              </div>

              <div className="bg-[#1a1b1f] rounded-xl p-6">
                <h3 className="text-gray-400 text-base mb-2">Valuation Cap</h3>
                <p className="text-white text-2xl">
                  {data.proposed_deal_structure.valuation_cap ? (
                    data.proposed_deal_structure.valuation_cap
                  ) : (
                    <span className="text-xs text-gray-500">Not disclosed</span>
                  )}
                </p>
              </div>

              <div className="bg-[#1a1b1f] rounded-xl p-6">
                <h3 className="text-gray-400 text-base mb-2">
                  Liquidation Preference
                </h3>
                <p className="text-white text-2xl">
                  {data.proposed_deal_structure.liquidation_preference ? (
                    data.proposed_deal_structure.liquidation_preference
                  ) : (
                    <span className="text-xs text-gray-500">Not disclosed</span>
                  )}
                </p>
              </div>

              <div className="bg-[#1a1b1f] rounded-xl p-6">
                <h3 className="text-gray-400 text-base mb-2">
                  Anti-Dilution Protection
                </h3>
                <p className="text-white text-2xl">
                  {data.proposed_deal_structure.anti_dilution_protection ? (
                    data.proposed_deal_structure.anti_dilution_protection
                  ) : (
                    <span className="text-xs text-gray-500">Not disclosed</span>
                  )}
                </p>
              </div>

              <div className="bg-[#1a1b1f] rounded-xl p-6">
                <h3 className="text-gray-400 text-base mb-2">Board Seat</h3>
                <p className="text-white text-2xl">
                  {data.proposed_deal_structure.board_seat ? (
                    data.proposed_deal_structure.board_seat
                  ) : (
                    <span className="text-xs text-gray-500">Not disclosed</span>
                  )}
                </p>
              </div>

              <div className="bg-[#1a1b1f] rounded-xl p-6 md:col-span-2">
                <h3 className="text-gray-400 text-base mb-2">
                  Vesting Schedule
                </h3>
                <p className="text-white text-2xl">
                  {data.proposed_deal_structure.vesting_schedule ? (
                    data.proposed_deal_structure.vesting_schedule
                  ) : (
                    <span className="text-xs text-gray-500">Not disclosed</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* Key Questions Section */}
          <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-200">
              Key Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  {data.key_questions?.market_strategy?.question ||
                    "What is the market strategy?"}
                </h4>
                <p className="text-sm text-gray-400">
                  {data.key_questions?.market_strategy?.answer || "N/A"}
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  {data.key_questions?.user_retention?.question ||
                    "How is user retention handled?"}
                </h4>
                <p className="text-sm text-gray-400">
                  {data.key_questions?.user_retention?.answer || "N/A"}
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  {data.key_questions?.regulatory_risks?.question ||
                    "What are the regulatory risks?"}
                </h4>
                <p className="text-sm text-gray-400">
                  {data.key_questions?.regulatory_risks?.answer || "N/A"}
                </p>
              </div>
            </div>
          </div>
          {/* Final Verdict Section */}
          <div className="backdrop-blur-sm border border-[#ffffff1a] rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-medium text-white mb-6">
              Final Verdict
            </h2>

            {/* Company Analysis Card */}
            <div className="bg-[#1a1b1f] rounded-xl p-6 mb-6">
              <h3 className="text-xl text-white mb-2">
                {data.company_overview.company_name}
              </h3>
              <p className="text-gray-300 text-base leading-relaxed mb-8">
                {data.company_overview.company_name} presents a compelling
                investment opportunity with a leading position in the{" "}
                {data.industry_type.toLowerCase()} sector. With validated
                technology and a robust growth trajectory, the company shows
                high potential for scalability and market penetration.
              </p>

              {/* Investment Potential Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Investment Potential</span>
                  <span className="text-white bg-[#ffffff1a] px-3 py-1 rounded-full text-sm">
                    {data.investment_score * 10}%
                  </span>
                </div>
                <div className="h-2 bg-[#ffffff0a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${data.investment_score * 10}%` }}
                  ></div>
                </div>
              </div>

              {/* Performance Analysis Title */}
              <h3 className="text-xl text-white mb-6 text-center">
                Performance Analysis
              </h3>

              {/* Radar Chart and Metrics Grid */}
              <div className="flex flex-row gap-8 items-start justify-center">
                {/* Radar Chart */}
                <div style={{ width: 420, height: 420 }} className="flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsRadarChart data={chartData}>
                      <defs>
                        <radialGradient id="radarGradient" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
                          <stop offset="28%" stopColor="#29272C" />
                          <stop offset="65%" stopColor="#B0B0B0" />
                          <stop offset="100%" stopColor="#FFFFFF" />
                        </radialGradient>
                      </defs>
                      <PolarGrid stroke="#ffffff1a" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />
                      <Radar
                        name="Metrics"
                        dataKey="value"
                        stroke="#B0B0B0"
                        fill="url(#radarGradient)"
                        fillOpacity={0.8}
                      />
                    </RechartsRadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Metrics List */}
                <div className="space-y-4 flex-1 min-w-[220px]">
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Product Viability</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.product_viability}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Market Potential</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.market_potential}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Sustainability</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.sustainability}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Exit Potential</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.exit_potential}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Risk Factors</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.risk_factor}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Innovation</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.innovation}
                    </span>
                  </div>
                  <div className="bg-[#ffffff0a] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-300">Competitive Edge</span>
                    <span className="text-white text-lg">
                      {data.final_verdict.competitive_edge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-8">
          <PDFDownloadLink
            document={<PitchDeckPDF data={data} />}
            fileName={`${data.company_overview.company_name}-analysis.pdf`}
            className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg bg-[linear-gradient(90deg,#36eefc_0%,#50919c_38%,#693597_92%)] hover:opacity-90 transition-all duration-200 shadow-[0_0_25px_rgba(54,238,252,0.25)] hover:shadow-[0_0_35px_rgba(54,238,252,0.45),0_0_15px_rgba(105,53,151,0.5)]"
          >
            <Download className="w-5 h-5" />
            Download Analysis
          </PDFDownloadLink>
          
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg bg-[#212228] hover:bg-[#2a2b33] border border-[#ffffff1a] transition-all duration-200"
          >
            <Globe className="w-5 h-5" />
            Generate New Report
          </button>
        </div>
      </div>
    </div>
  );
};

const ReputationAnalysisCard: React.FC<{ data: MistralResponse }> = ({
  data,
}) => {
  const { reputation_analysis } = data;

  if (!reputation_analysis) {
    return null;
  }

  const categories = [
    { name: "News Media", data: reputation_analysis.news_media },
    { name: "Social Media", data: reputation_analysis.social_media },
    { name: "Investor Reviews", data: reputation_analysis.investor_reviews },
    { name: "Customer Feedback", data: reputation_analysis.customer_feedback },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "text-green-500";
      case "Neutral":
        return "text-yellow-500";
      case "Negative":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-[#1a1b1f] rounded-xl p-6">
      <h3 className="text-xl text-white mb-6">Reputation Analysis</h3>
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex items-center justify-between p-4 border border-[#ffffff1a] rounded-lg"
          >
            <div>
              <h4 className="text-white font-medium">{category.name}</h4>
              <p
                className={`text-sm ${getSentimentColor(
                  category.data.sentiment
                )}`}
              >
                {category.data.sentiment}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < category.data.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-white text-sm font-medium">
                {category.data.score.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 border border-[#ffffff1a] rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium">Overall Reputation</h4>
          <div className="flex items-center gap-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < reputation_analysis.overall.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-white text-sm font-medium">
              {reputation_analysis.overall.score.toFixed(1)}
            </span>
          </div>
        </div>
        <p
          className={`mt-2 text-sm ${getSentimentColor(
            reputation_analysis.overall.sentiment
          )}`}
        >
          Overall Sentiment: {reputation_analysis.overall.sentiment}
        </p>
      </div>
    </div>
  );
};

export default AnalysisReport;
