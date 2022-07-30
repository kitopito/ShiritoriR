//import { createClient } from "https://deno.land/x/supabase/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.4";
//import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const supabaseURL = "https://zxujmotglbqbfshcmrao.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dWptb3RnbGJxYmZzaGNtcmFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTg5MzIyODAsImV4cCI6MTk3NDUwODI4MH0.Q9VJ5eLlEyYqRgcVxUMaxnQ_vExAQRZ5DjVKj_mK6y0";
export const supabase = createClient(
    supabaseURL, // URL
    supabaseKey, // anonキー
//    {}
);