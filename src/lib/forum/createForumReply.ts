import { createClient } from "@/lib/supabase/server";

import type { CreateForumReplyInput } from "@/types/forum";

import { validateForumReply } from "./validation";

export async function CreateForumReply(
    input: CreateForumReplyInput,
): Promise<string> {
    const supabase = await createClient();
}
