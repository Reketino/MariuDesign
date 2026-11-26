"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

async function verifyAdmin() {
    const supabase = await createClient();

    const { data: {user}, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("You must be logged in.");
    }

    const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
}