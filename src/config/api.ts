export const API_CONFIG = {
  BASE_URL: 'https://api.mistral.ai/v1/chat/completions',
  MODEL: 'mistral-large-latest',
  MISTRAL_API_KEY: import.meta.env.VITE_MISTRAL_API_KEY
};

export const ANALYSIS_PROMPTS = {
  SLIDE_ANALYSIS: `You are an expert presentation analyst. Analyze this slide and provide detailed feedback on:
1. Content Analysis:
   - Key message clarity and effectiveness
   - Information hierarchy and organization
   - Text density and readability
   - Use of data and statistics

2. Visual Design:
   - Layout and composition
   - Color scheme effectiveness
   - Typography and font choices
   - Visual elements and imagery
   - White space utilization

3. Engagement & Impact:
   - Audience engagement potential
   - Memorability factors
   - Professional appearance
   - Brand consistency

4. Specific Improvements:
   - Content refinements
   - Design enhancements
   - Structural adjustments
   - Engagement boosters

Rate each aspect from 1-10 and provide actionable recommendations.`,

  DECK_ANALYSIS: `You are an expert presentation analyst. Review this presentation deck and provide comprehensive feedback on:
1. Overall Structure:
   - Flow and narrative coherence
   - Slide transitions and connections
   - Story arc effectiveness
   - Beginning and ending impact

2. Content Quality:
   - Message clarity across slides
   - Information distribution
   - Supporting evidence usage
   - Key points emphasis

3. Visual Consistency:
   - Design system adherence
   - Branding consistency
   - Visual hierarchy maintenance
   - Template usage

4. Engagement Strategy:
   - Audience interaction points
   - Attention management
   - Memorable elements
   - Call-to-action effectiveness

5. Detailed Recommendations:
   - Structure improvements
   - Content enhancements
   - Design refinements
   - Engagement boosters

Rate each section from 1-10 and provide specific, actionable improvements.`,

  INSIGHT_GENERATION: `As a presentation expert, analyze the following feedback and generate structured insights:
1. Key Strengths:
   - Highlight top performing elements
   - Identify successful strategies
   - Note effective techniques

2. Primary Challenges:
   - Point out main areas for improvement
   - Identify potential risks
   - Note consistency issues

3. Improvement Strategy:
   - Prioritized recommendations
   - Specific action items
   - Implementation suggestions

4. Best Practices Alignment:
   - Industry standard comparisons
   - Professional guidelines
   - Modern presentation trends

Provide clear, actionable insights with specific examples and implementation steps.`
}; 