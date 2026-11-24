import { createClient } from "@/lib/supabase/server";

import type { ForumTopicWithReplies } from "@/types/forum";

export async function getForumTopicById(
  topicId: string,
): Promise<ForumTopicWithReplies | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
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

  const userIds = [
    data.user_id,
    ...visibleReplies.map((reply) => reply.user_id),
  ].filter((id): id is string => id != null);

  const uniqueUserIds = [...new Set(userIds)];

  const usernameMap = new Map<string, string>();

  if (uniqueUserIds.length > 0) {
    const { data: profiles, error: profileError } = await supabase
    .from("forum_profiles")
    .select("id, username")
    .in("id", uniqueUserIds);

    if (profileError) {
      console.error("Failed to fetch forum usernames:", profileError);
    } else {
      profiles?.forEach((profile) => {
        if (profile.username) {
          usernameMap.set(profile.id, profile.username);
        }
      });
    }
  }

  return {
    ...data,
    author_username: data.user_id
    ? usernameMap.get(data.user_id) ?? null
    : null,
    forum_replies: visibleReplies,
  } as ForumTopicWithReplies;
}
