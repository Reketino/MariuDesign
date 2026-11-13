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

  let query = supabase
    .from("forum_topics")
    .select(
      `
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
    `,
    )
    .eq("is_hidden", false);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch forum topics:", error);
    throw new Error("Could not fetch forum topics.");
  }

  return (data ?? []).map((topic) => ({
    ...topic,
    forum_replies: (topic.forum_replies ?? [])
      .filter((reply) => !reply.is_hidden)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      ),
  })) as ForumTopicWithReplies[];
}
