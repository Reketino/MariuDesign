import { createClient } from "@/lib/supabase/server";
import type { ForumCategory } from "@/types/forum";

export async function getForumCategoryBySlug(
    slug: string,
): Promise<ForumCategory | null> {
      const supabase = await createClient();

    const { data, error } = await supabase
    .from("forum_categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

}