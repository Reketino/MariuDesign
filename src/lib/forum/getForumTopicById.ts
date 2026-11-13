import { createClient } from "@/lib/supabase/server";

import type { ForumTopicWithReplies } from "@/types/forum";

export async function getForumTopicById(
    topicId: string,
): Promise<ForumTopicWithReplies | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
    .from("forum_topics")
    .select(`
      id,
      category_id,
      user_id,
      product_id,
      title,
      content,
      is_pinned,
      is_locked,
      is_hidden,
      created_at,
      updated_at,
      forum_replies (
        id,
        topic_id,
        user_id,
        content,
        is_official,
        is_hidden,
        created_at,
        updated_at
      )
    `)
    .eq("id", topicId)
    .eq("is_hidden", false)
    .maybeSingle();
   
    return {
        ...data,
        forum_replies: visibleReplies,
    } as ForumTopicWithReplies
}