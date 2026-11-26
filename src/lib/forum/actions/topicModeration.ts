"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

async function verifyAdmin() {
    const supabase = await createClient();

    const { data: {user}, error: authError } = await supabase.auth.getUser();
}