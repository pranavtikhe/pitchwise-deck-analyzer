import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }
  return supabaseClient;
}

// Types for our database tables
export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  subscription_tier: 'free' | 'plus' | 'ultra'
}

export type Contract = {
  id: string
  user_id: string
  title: string
  content: string
  type: 'generated' | 'uploaded'
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  file_url: string | null
  file_type: 'pdf' | 'docx' | null
}

export type AnalysisResult = {
  id: string
  contract_id: string
  user_id: string
  risk_score: number
  analysis_summary: string
  key_findings: any
  recommendations: any
  created_at: string
  status: 'pending' | 'completed'
}

export type ContractHistory = {
  id: string
  contract_id: string
  user_id: string
  action: 'created' | 'updated' | 'analyzed'
  details: any
  created_at: string
} 