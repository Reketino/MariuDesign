import { createClient } from "@/lib/supabase/server";

import type { CreateForumReplyInput } from "@/types/forum";

import { validateForumReply } from "./validation";
import { AuthError } from "@supabase/supabase-js";

export async function CreateForumReply(
    input: CreateForumReplyInput,
): Promise<string> {
    const supabase = await createClient();

    const {
        data: { user },
        error: AuthError,
    } = await supabase.auth.getUser();
}
