
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fjddlslynjxoesahiiux.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZGRsc2x5bmp4b2VzYWhpaXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTY1MzksImV4cCI6MjA3ODA3MjUzOX0.4QPdcHByRjXmgjqRNqqu0VHPHMDvJQ0HNTbyxYKzdhY';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
