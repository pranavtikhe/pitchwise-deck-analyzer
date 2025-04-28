export const API_CONFIG = {
  MISTRAL_BASE_URL: 'https://api.mistral.ai/v1/chat/completions',
  OPENAI_BASE_URL: 'https://api.openai.com/v1/chat/completions',
  MISTRAL_API_KEY: import.meta.env.VITE_MISTRAL_API_KEY,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  DEFAULT_MODEL: import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4-turbo-preview'
};

export const ANALYSIS_PROMPTS = {
  SLIDE_ANALYSIS: `Analyze the following slide content and provide insights about its key points, visual elements, and overall effectiveness.`
};
