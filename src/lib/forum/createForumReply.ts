import { createClient } from "@/lib/supabase/server";

import type { CreateForumReplyInput } from "@/types/forum";

export async function CreateForumReply(
    input: CreateForumReplyInput,
): Promise<string> {
    const supabase = await createClient();

    const {
        data: { user },
        error: AuthError,
    } = await supabase.auth.getUser();
}
