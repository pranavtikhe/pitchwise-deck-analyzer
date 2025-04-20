import React, { useEffect, useState } from "react";
import { MistralResponse } from "../services/pdfService";
import { format } from "date-fns";
import styles from "@/styles/upload.module.scss";
import RadarChart from "./RadarChart";
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
import History from "./History";

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
          <Text key={index} style={pdfStyles.text}>
            • {opinion}
          </Text>
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

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data }) => {
  const [showHistory, setShowHistory] = useState(false);

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
        <History />
      </div>
    );
  }

  // Handle loading state
  if (!data) {
    return (
      <div className={styles.gradientWrapper}>
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
    <div className={styles.gradientWrapper}>
      <img
        src="/images/backgroundgradiant.png"
        alt="Gradient Background"
        className={styles.gradientBackground}
      />
      <div className={styles.innerBox}>
        <h1 className={`${styles.title} text-center mb-8`}>Analysis Report</h1>

        {/* Type and Date */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-white mb-2">
            {data.industry_type}
          </h2>
          <p className="text-gray-400">
            {format(data.analyzedAt, "MMMM dd yyyy")} at{" "}
            {format(data.analyzedAt, "HH:mm")}
          </p>
        </div>

        {/* Company Overview Grid */}
        <div className="mb-12">
          <h3 className="text-white text-lg mb-6">Company Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
              <div key={index} className="bg-black/20 rounded-lg p-4">
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
          <h3 className="text-white text-lg mb-6">Pros & Cons</h3>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div>
              <h4 className="text-white mb-4">Strengths (Pros)</h4>
              <div className="space-y-3">
                {data.strengths.map((strength, index) => (
                  <div key={index} className="bg-black/20 rounded-lg p-3">
                    <div className="flex gap-3">
                      <span className="text-green-500">+</span>
                      <p className="text-gray-300">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white mb-4">Weaknesses (Cons)</h4>
              <div className="space-y-3">
                {data.weaknesses.map((weakness, index) => (
                  <div key={index} className="bg-black/20 rounded-lg p-3">
                    <div className="flex gap-3">
                      <span className="text-red-500">-</span>
                      <p className="text-gray-300">{weakness}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitive Competitors */}
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-6">Competitor Comparison</h2>
            <div className="grid grid-cols-5 gap-0 border-t border-gray-700">
              <div className="border-r border-gray-700 p-4 font-bold">
                Competitors
              </div>
              <div className="border-r border-gray-700 p-4">Draft Kings</div>
              <div className="border-r border-gray-700 p-4">FanDuel</div>
              <div className="border-r border-gray-700 p-4">Sleeper</div>
              <div className="border-r border-gray-700 p-4">
                Monkey Knife Fight
              </div>
              <div className="border-r border-gray-700 p-4">RealFevr</div>
              <div className="border-r border-gray-700 p-4 font-bold">
                Key Investors
              </div>
              <div className="border-r border-gray-700 p-4">
                Early Stage VC, IPO
              </div>
              <div className="border-r border-gray-700 p-4">
                Flutter Entertainment
              </div>
              <div className="border-r border-gray-700 p-4">
                Andreessen Horowitz
              </div>
              <div className="border-r border-gray-700 p-4">Bally's Corp</div>
              <div className="border-r border-gray-700 p-4">
                Private, Seed/ Series A
              </div>
              <div className="border-r border-gray-700 p-4 font-bold">
                Amount Raised
              </div>
              <div className="border-r border-gray-700 p-4">$719M+ pre-IPO</div>
              <div className="border-r border-gray-700 p-4">$500M+</div>
              <div className="border-r border-gray-700 p-4">~$60M</div>
              <div className="border-r border-gray-700 p-4">Acquired</div>
              <div className="border-r border-gray-700 p-4">~$10M</div>
              <div className="border-r border-gray-700 p-4 font-bold">
                Market Position
              </div>
              <div className="border-r border-gray-700 p-4">
                Market leader in DFS
              </div>
              <div className="border-r border-gray-700 p-4">
                Top DFS + sportsbook
              </div>
              <div className="border-r border-gray-700 p-4">
                Gen Z-targeted fantasy sports
              </div>
              <div className="border-r border-gray-700 p-4">Mid-market DFS</div>
              <div className="border-r border-gray-700 p-4">
                NFT x fantasy market
              </div>
              <div className="border-r border-gray-700 p-4 font-bold">
                Strengths
              </div>
              <div className="border-r border-gray-700 p-4">
                Deep capital, user base, brand
              </div>
              <div className="border-r border-gray-700 p-4">
                Aggressive market reach
              </div>
              <div className="border-r border-gray-700 p-4">
                Community-based social fantasy
              </div>
              <div className="border-r border-gray-700 p-4">
                Simple UX, niche players
              </div>
              <div className="border-gray-700 p-4">
                Blockchain fantasy niche
              </div>
            </div>
          </div>

          {/* table of findings */}
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-6">
              Summary Table of Findings
            </h2>
            <div className="grid grid-cols-3 gap-0 border-t border-gray-700">
              <div className="border-r border-gray-700 p-4">Sirf</div>
              <div className="border-r border-gray-700 p-4">DraftKings</div>
              <div className="border-r border-gray-700 p-4">FanDuel</div>
              <div className="border-r border-gray-700 p-4">Sleeper</div>
              <div className="border-r border-gray-700 p-4">
                Monkey Knife Fight
              </div>
              <div className="border-r border-gray-700 p-4">RealFevr</div>
              <div className="border-r border-gray-700 p-4 font-bold">
                Market Share
              </div>
              <div className="border-r border-gray-700 p-4">Emerging</div>
              <div className="border-r border-gray-700 p-4">35%+</div>
              <div className="border-r border-gray-700 p-4">30%+</div>
              <div className="border-r border-gray-700 p-4">&lt;5%</div>
              <div className="border-r border-gray-700 p-4">&lt;3%</div>
              <div className="border-r border-gray-700 p-4">&lt;1%</div>
              <div className="border-r border-gray-700 p-4 font-bold">
                Key Investors
              </div>
              <div className="border-r border-gray-700 p-4">
                Contest Fees + Margins
              </div>
              <div className="border-r border-gray-700 p-4">
                Contest + Betting
              </div>
              <div className="border-r border-gray-700 p-4">
                Contest + Betting
              </div>
              <div className="border-r border-gray-700 p-4">Social games</div>
              <div className="border-r border-gray-700 p-4">
                Simple contests
              </div>
              <div className="border-r border-gray-700 p-4">
                NFTs, Tokenomics
              </div>
              <div className="border-r border-gray-700 p-4 font-bold">
                Growth Rate
              </div>
              <div className="border-r border-gray-700 p-4">
                Projected 5x In Y2
              </div>
              <div className="border-r border-gray-700 p-4">Steady</div>
              <div className="border-r border-gray-700 p-4">Steady</div>
              <div className="border-r border-gray-700 p-4">Fast</div>
              <div className="border-r border-gray-700 p-4">Flat</div>
              <div className="border-r border-gray-700 p-4">Niche growth</div>
              <div className="border-r border-gray-700 p-4 font-bold">
                Key Differentiator
              </div>
              <div className="border-r border-gray-700 p-4">
                eSports-focused, global-friendly
              </div>
              <div className="border-r border-gray-700 p-4">
                Established Player
              </div>
              <div className="border-r border-gray-700 p-4">
                Betting integration
              </div>
              <div className="border-r border-gray-700 p-4">
                Community-first
              </div>
              <div className="border-r border-gray-700 p-4">UX simplicity</div>
              <div className="border-gray-700 p-4">Blockchain integration</div>
            </div>
          </div>

          {/* expert opinions */}
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-6">
              Industry Expert Opinions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 bg-opacity-70 rounded-lg p-4 shadow-lg">
                <h3 className="text-lg mb-2">Mike Voorhaus</h3>
                <p className="text-gray-400 mb-1">Affiliation</p>
                <p className="mb-2">eSports VC, Early DK Investor</p>
                <p className="text-gray-400 mb-1">Opinion Summary</p>
                <p className="mb-2">
                  Believes in platform scalability and market fit for Gen Z
                </p>
                <p className="text-gray-400 mb-1">Reference</p>
                <p className="mb-2">Internal Deck</p>
                <p className="text-gray-400 mb-1">Date</p>
                <p>2024</p>
              </div>
              <div className="bg-gray-800 bg-opacity-70 rounded-lg p-4 shadow-lg">
                <h3 className="text-lg mb-2">eSports Insider</h3>
                <p className="text-gray-400 mb-1">Affiliation</p>
                <p className="mb-2">Industry Publication</p>
                <p className="text-gray-400 mb-1">Opinion Summary</p>
                <p className="mb-2">
                  Notes increasing demand for fantasy eSports with real-time
                  engagement
                </p>
                <p className="text-gray-400 mb-1">Reference</p>
                <p className="mb-2">ESI Report</p>
                <p className="text-gray-400 mb-1">Date</p>
                <p>2022</p>
              </div>
              <div className="bg-gray-800 bg-opacity-70 rounded-lg p-4 shadow-lg">
                <h3 className="text-lg mb-2">Abios Gaming</h3>
                <p className="text-gray-400 mb-1">Affiliation</p>
                <p className="mb-2">eSports Data API Provider</p>
                <p className="text-gray-400 mb-1">Opinion Summary</p>
                <p className="mb-2">
                  Expects high scalability via API integrations and regional
                  gamification
                </p>
                <p className="text-gray-400 mb-1">Reference</p>
                <p className="mb-2">Abios Report</p>
                <p className="text-gray-400 mb-1">Date</p>
                <p>2023</p>
              </div>
            </div>
          </div>

          {/* conclusion */}
          <div className="text-white ">
            <h2 className="text-2xl font-bold mb-6">Expert Conclusion</h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <p className="text-gray-400">Product Viability</p>
                <p>7</p>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <p className="text-gray-400">Market Potential</p>
                <p>9</p>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <p className="text-gray-400">Sustainability</p>
                <p>6</p>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <p className="text-gray-400">Innovation</p>
                <p>8</p>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <p className="text-gray-400">Exit Potential</p>
                <p>7</p>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <p className="text-gray-400">Risk Factors</p>
                <p>6</p>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <p className="text-gray-400">Competitive Advantage</p>
                <p>7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* final verdict */}
      <div className="flex flex-col gap-8">
        <div className={styles.innerBox}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-white text-lg mb-6">Performance Analysis</h3>
              <div className="h-[400px]">
                <RadarChart data={data.final_verdict} />
              </div>
            </div>
            <div className="flex-1 text-white p-6">
              <h2 className="text-3xl font-bold mb-6">Final Verdict</h2>
              <p className="text-gray-300 mb-6">
                Sirf shows significant potential in an emerging market with a
                well-planned approach to tap into the untapped eSports daily fantasy
                industry.
              </p>
              <div className="grid grid-cols-2 gap-px bg-gray-700">
                <div className="p-4 bg-teal-900">
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-gray-400">Product Viability</p>
                </div>
                <div className="p-4 bg-teal-900">
                  <p className="text-3xl font-bold">9</p>
                  <p className="text-gray-400">Market Potential</p>
                </div>
                <div className="p-4 bg-teal-900">
                  <p className="text-3xl font-bold">7</p>
                  <p className="text-gray-400">Sustainability</p>
                </div>
                <div className="p-4 bg-teal-900">
                  <p className="text-3xl font-bold">7</p>
                  <p className="text-gray-400">Exit Potential</p>
                </div>
                <div className="p-4 bg-teal-900">
                  <p className="text-3xl font-bold">6</p>
                  <p className="text-gray-400">Risk Factors</p>
                </div>
                <div className="p-4 bg-teal-900">
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-gray-400">Innovation</p>
                </div>
                <div className="p-4 bg-teal-900">
                  <p className="text-3xl font-bold">7</p>
                  <p className="text-gray-400">Competitive Edge</p>
                </div>
                <div className="p-4 bg-teal-900"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
