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
}
