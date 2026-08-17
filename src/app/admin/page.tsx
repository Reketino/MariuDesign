import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
    const supabase = await createClient()
}