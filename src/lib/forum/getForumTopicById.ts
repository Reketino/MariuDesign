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

    if (error) {
        console.error("Failed to fetch forum topic:", error);
        throw new Error("Could not fetch forum topic.");
    }

    if (!data) {
        return null;
    }

    const visibleReplies = (data.forum_replies ?? [])
    .filter((reply) => !reply.is_hidden)
    .sort(
        (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    
    return {
        ...data,
        forum_replies: visibleReplies,
    } as ForumTopicWithReplies
}