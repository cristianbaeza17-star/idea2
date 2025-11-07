
import type { Session } from '@supabase/supabase-js';

export interface Idea {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
}

export type AuthSession = Session | null;
