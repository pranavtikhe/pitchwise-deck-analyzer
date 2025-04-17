import { useState } from 'react';
import { analysisService, AnalysisResult } from '../services/analysisService';

interface AnalysisState {
  loading: boolean;
  error: string | null;
  results: AnalysisResult | null;
}

export const useAnalysis = () => {
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    error: null,
    results: null
  });

  const analyzeSlide = async (content: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const results = await analysisService.analyzeSlide(content);
      setState(prev => ({ ...prev, results }));
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze slide';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const analyzeDeck = async (content: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const results = await analysisService.analyzeDeck(content);
      setState(prev => ({ ...prev, results }));
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze deck';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const generateInsights = async (analysisResults: AnalysisResult[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const results = await analysisService.generateInsights(analysisResults);
      setState(prev => ({ ...prev, results }));
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate insights';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    ...state,
    analyzeSlide,
    analyzeDeck,
    generateInsights
  };
}; 