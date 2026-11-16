import { createClient } from "@/lib/supabase/server";

import type { CreateForumReplyInput } from "@/types/forum";
import { validateForumReply } from "./validation";

export async function CreateForumReply(
    input: CreateForumReplyInput,
): Promise<string> {
    const supabase = await createClient();

    const {
        data: { user },
        error: AuthError,
    } = await supabase.auth.getUser();

    if (AuthError || !user) {
        throw new Error("You must be logged in to reply.");
    }

    const validation = validateForumReply(input.content);

    if (!validation.success) {
        throw new Error(validation.error);
    }

     const { data: topic, error: topicError } = await supabase
    .from("forum_topics")
    .select("id")
    .eq("id", input.topic_id)
    .eq("is_hidden", false)
    .eq("is_locked", false)
    .maybeSingle();

    if (topicError) {
        console.error("Failed to validate forum topic:", topicError);
        throw new Error("Could not validate forum topic.");
    }

    if (!topic) {
        throw new Error("This topic is not available for replies.");
    }

    const { data: reply, error: insertError } = await supabase
    .from("forum_replies")
    .insert({
      topic_id: input.topic_id,
      user_id: user.id,
      content: input.content.trim(),
    })
    .select("id")
    .single();
}
