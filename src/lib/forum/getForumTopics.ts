
import { createClient } from "@/lib/supabase/server";

import type { ForumTopicWithReplies } from "@/types/forum";

type GetForumTopicsOptions = {
categoryId?: string;
limit?: number;
};

export async function GetForumTopics({
    categoryId,
    limit = 20,
}: GetForumTopicsOptions = {}): Promise<ForumTopicWithReplies[]> {
    const supabase = await createClient();
}