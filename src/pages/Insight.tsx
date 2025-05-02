import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getAnalysisReport } from "@/services/storageService";
import { MistralResponse } from "@/services/pdfService";
import { toast } from "@/components/ui/sonner";
import { Loader2, TrendingUp, Building, Users, DollarSign, Target, Shield, Lightbulb, BarChart2, AlertTriangle, ChevronLeft } from "lucide-react";
import styles from "@/styles/Navbar.module.scss";

const Insight = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<MistralResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsight = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("No insight ID provided");
        }
        const data = await getAnalysisReport(`analysis-${id}`);
        setInsight(data.insights);
      } catch (error) {
        console.error("Error loading insight:", error);
        toast.error("Failed to load insight details");
        navigate("/history");
      } finally {
        setLoading(false);
      }
    };

    loadInsight();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple" />
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No insight data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8 px-4">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analysis Report</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of the pitch deck
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Overview */}
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-purple" />
              <h2 className="text-xl font-semibold">Company Overview</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Company Name</h3>
                <p className="text-muted-foreground">{insight.company_overview.company_name}</p>
              </div>
              <div>
                <h3 className="font-medium">Industry</h3>
                <p className="text-muted-foreground">{insight.company_overview.industry}</p>
              </div>
              <div>
                <h3 className="font-medium">Business Model</h3>
                <p className="text-muted-foreground">{insight.company_overview.business_model}</p>
              </div>
              <div>
                <h3 className="font-medium">Key Offerings</h3>
                <p className="text-muted-foreground">{insight.company_overview.key_offerings}</p>
              </div>
              <div>
                <h3 className="font-medium">Founded On</h3>
                <p className="text-muted-foreground">
                  {insight.company_overview.founded_on && insight.company_overview.founded_on !== "N/A" ? (
                    insight.company_overview.founded_on
                  ) : insight.company_overview.founded_year ? (
                    `Founded in ${insight.company_overview.founded_year} (year from web search)`
                  ) : (
                    <span className="text-muted-foreground/70">Not available in pitch deck or web search</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="h-5 w-5 text-purple" />
              <h2 className="text-xl font-semibold">Market Analysis</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Market Size</h3>
                <p className="text-muted-foreground">{insight.market_analysis.market_size}</p>
              </div>
              <div>
                <h3 className="font-medium">Growth Rate</h3>
                <p className="text-muted-foreground">{insight.market_analysis.growth_rate}</p>
              </div>
              
              
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-purple" />
              <h2 className="text-xl font-semibold">Strengths</h2>
            </div>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              {insight.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-purple" />
              <h2 className="text-xl font-semibold">Weaknesses</h2>
            </div>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              {insight.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>

          {/* Funding History */}
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-purple" />
              <h2 className="text-xl font-semibold">Funding History</h2>
            </div>
            <div className="space-y-4">
              {insight.funding_history?.rounds && insight.funding_history.rounds.length > 0 ? (
                insight.funding_history.rounds.map((round, index) => (
                  <div key={index} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-medium">{round.type}</h3>
                    <p className="text-muted-foreground">Amount: {round.amount}</p>
                    <div>
                      <span className="text-muted-foreground">Key Investors:</span>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {round.key_investors.map((investor, i) => (
                          <li key={i}>{investor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="flex flex-col items-center gap-2">
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No funding history specified in the pitch deck</p>
                    <p className="text-sm text-muted-foreground/70">This could indicate either:</p>
                    <ul className="text-sm text-muted-foreground/70 list-disc list-inside">
                      <li>Pre-seed stage startup</li>
                      <li>Self-funded/bootstrapped company</li>
                      <li>Funding details not disclosed in the deck</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Competitor Analysis */}
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-purple" />
              <h2 className="text-xl font-semibold">Competitor Analysis</h2>
            </div>
            <div className="space-y-6">
              {insight.competitor_analysis.competitors.map((competitor, index) => (
                <div key={index} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-medium text-lg mb-2">{competitor.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Key Investors:</span>
                      <p className="mt-1">{competitor.key_investors}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount Raised:</span>
                      <p className="mt-1">{competitor.amount_raised}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Market Position:</span>
                      <p className="mt-1">{competitor.market_position}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Strengths:</span>
                      <p className="mt-1">{competitor.strengths}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Comparison */}
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-purple" />
              <h2 className="text-xl font-semibold">Market Comparison</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Startup Metrics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Growth Rate:</span>
                    <p className="mt-1">{insight.market_comparison.metrics.startup.growth_rate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Market Share:</span>
                    <p className="mt-1">{insight.market_comparison.metrics.startup.market_share}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue Model:</span>
                    <p className="mt-1">{insight.market_comparison.metrics.startup.revenue_model}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Differentiator:</span>
                    <p className="mt-1">{insight.market_comparison.metrics.startup.differentiator}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Verdict */}
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-purple" />
              <h2 className="text-xl font-semibold">Final Verdict</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Product Viability:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple h-2 rounded-full" 
                        style={{ width: `${insight.final_verdict.product_viability * 10}%` }}
                      />
                    </div>
                    <span className="text-sm">{insight.final_verdict.product_viability}/10</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Market Potential:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple h-2 rounded-full" 
                        style={{ width: `${insight.final_verdict.market_potential * 10}%` }}
                      />
                    </div>
                    <span className="text-sm">{insight.final_verdict.market_potential}/10</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Sustainability:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple h-2 rounded-full" 
                        style={{ width: `${insight.final_verdict.sustainability * 10}%` }}
                      />
                    </div>
                    <span className="text-sm">{insight.final_verdict.sustainability}/10</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Innovation:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple h-2 rounded-full" 
                        style={{ width: `${insight.final_verdict.innovation * 10}%` }}
                      />
                    </div>
                    <span className="text-sm">{insight.final_verdict.innovation}/10</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Exit Potential:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple h-2 rounded-full" 
                        style={{ width: `${insight.final_verdict.exit_potential * 10}%` }}
                      />
                    </div>
                    <span className="text-sm">{insight.final_verdict.exit_potential}/10</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Risk Factor:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple h-2 rounded-full" 
                        style={{ width: `${insight.final_verdict.risk_factor * 10}%` }}
                      />
                    </div>
                    <span className="text-sm">{insight.final_verdict.risk_factor}/10</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Competitive Edge:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple h-2 rounded-full" 
                        style={{ width: `${insight.final_verdict.competitive_edge * 10}%` }}
                      />
                    </div>
                    <span className="text-sm">{insight.final_verdict.competitive_edge}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Insight; 