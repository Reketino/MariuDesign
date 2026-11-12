import { createClient } from "@/lib/supabase/server";

import type { ForumCategory } from "@/types/forum";

export async function getForumCategories(): Promise<ForumCategory[]> {
    const supabase = await createClient();

    
}