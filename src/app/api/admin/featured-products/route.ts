import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function isAdmin() {
    const supabase = await createClient();

    const {data: {user}, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return false;
    }

    const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("role")
    .eq("id", user.id)
    .single();

    return !profileError && profile?.role === "admin";
}
