
import { createClient } from '@supabase/supabase-js';

// Use provided credentials as default if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hckjenyvezcfkrbdxksy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhja2plbnl2ZXpjZmtyYmR4a3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzA1MzEsImV4cCI6MjA3OTMwNjUzMX0.qA9dCS1ypdMpbQNWQMK2sVtqLUeCs67PiWPocsuEG0Q';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export const isSupabaseConfigured = () => {
  // Check if we have real credentials (not the dummy ones from previous steps)
  return supabaseUrl !== 'https://demo.supabase.co' && supabaseAnonKey !== 'demo-key';
};
