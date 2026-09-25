import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gndbhnldriergwfgktfh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZGJobmxkcmllcmd3ZmdrdGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MzE1ODMsImV4cCI6MjEwNDIwNzU4M30.qS1hVAJz28_I4ose1GCT8jsGj0YGI1lzr6ClH90nC7I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        cache: 'no-store'
      });
    }
  }
});
