import { createClient } from "@supabase/supabase-js"

const supabase = process.env.NEXT_PUBLIC_SUPABASETF_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;