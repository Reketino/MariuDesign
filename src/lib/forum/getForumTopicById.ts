import { createClient } from "@/lib/supabase/server";

import type { ForumTopicWithReplies } from "@/types/forum";

export async function getForumTopicById(
    topicId: string,
): Promise<ForumTopicWithReplies | null> {
    const supabase = await createClient();
}