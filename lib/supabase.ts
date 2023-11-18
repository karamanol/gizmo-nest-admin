import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY as string
);

export default supabase;
