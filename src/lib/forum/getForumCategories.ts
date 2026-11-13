import { createClient } from "@/lib/supabase/server";

import type { ForumCategory } from "@/types/forum";

export async function getForumCategories(): Promise<ForumCategory[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
    .from("forum_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
}