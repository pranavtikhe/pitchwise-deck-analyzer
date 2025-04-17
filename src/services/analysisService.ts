import { API_CONFIG, ANALYSIS_PROMPTS } from '../config/api';

export interface AnalysisResult {
  content: string;
  scores?: {
    [key: string]: number;
  };
  recommendations: string[];
  metadata: {
    processingTime: number;
    confidence: number;
    model: string;
  };
}

class AnalysisService {
  private headers: HeadersInit;
  private model: string;

  constructor() {
    this.model = API_CONFIG.MODEL;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.MISTRAL_API_KEY}`
    };
    console.log('🤖 Initializing Analysis Service with Mistral AI');
    console.log(`📌 Using model: ${this.model}`);
  }

  private async analyze(content: string, prompt: string): Promise<AnalysisResult> {
    try {
      const startTime = Date.now();
      console.log(`🔄 Starting analysis with Mistral AI - ${this.model}`);
      
      const response = await fetch(API_CONFIG.BASE_URL, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: prompt
            },
            {
              role: 'user',
              content: content
            }
          ],
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        console.error(`❌ Mistral API error: ${response.status}`);
        throw new Error(`Analysis failed with status ${response.status}`);
      }

      const result = await response.json();
      const analysis = result.choices[0].message.content;
      
      console.log('✅ Mistral analysis completed successfully');
      
      // Extract scores (ratings from 1-10)
      const scores: { [key: string]: number } = {};
      const scoreMatches = analysis.match(/(\d+)\/10/g) || [];
      const aspects = ['Content', 'Visual', 'Engagement', 'Structure'];
      scoreMatches.forEach((score, index) => {
        if (aspects[index]) {
          scores[aspects[index]] = parseInt(score);
        }
      });

      // Extract recommendations
      const recommendations = analysis
        .split('\n')
        .filter(line => line.includes('•') || line.includes('-'))
        .map(line => line.replace(/^[•-]\s*/, '').trim())
        .filter(line => line.length > 0);

      const processingTime = (Date.now() - startTime) / 1000;
      console.log(`⏱️ Processing time: ${processingTime.toFixed(2)}s`);

      return {
        content: analysis,
        scores,
        recommendations: recommendations.length > 0 ? recommendations : ['No specific recommendations provided'],
        metadata: {
          processingTime,
          confidence: result.choices[0].finish_reason === 'stop' ? 0.95 : 0.8,
          model: this.model
        }
      };
    } catch (error) {
      console.error('❌ Mistral analysis error:', error);
      throw new Error(error instanceof Error ? error.message : 'Analysis failed');
    }
  }

  async analyzeSlide(slideContent: string): Promise<AnalysisResult> {
    console.log('📊 Starting slide analysis');
    return this.analyze(slideContent, ANALYSIS_PROMPTS.SLIDE_ANALYSIS);
  }

  async analyzeDeck(deckContent: string): Promise<AnalysisResult> {
    console.log('📑 Starting deck analysis');
    return this.analyze(deckContent, ANALYSIS_PROMPTS.DECK_ANALYSIS);
  }

  async generateInsights(analysisResults: AnalysisResult[]): Promise<AnalysisResult> {
    console.log('🎯 Generating insights from previous analyses');
    const combinedContent = analysisResults
      .map(result => result.content)
      .join('\n\n---\n\n');
    return this.analyze(combinedContent, ANALYSIS_PROMPTS.INSIGHT_GENERATION);
  }
}

export const analysisService = new AnalysisService(); 