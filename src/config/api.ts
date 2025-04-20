export const API_CONFIG = {
  MISTRAL_BASE_URL: 'https://api.mistral.ai/v1/chat/completions',
  MISTRAL_API_KEY: import.meta.env.VITE_MISTRAL_API_KEY
};

export const ANALYSIS_PROMPTS = {
  SLIDE_ANALYSIS: `