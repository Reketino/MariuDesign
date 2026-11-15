import { createClient } from "@/lib/supabase/server";

import type { CreateForumTopicInput } from "@/types/forum";

import { validateForumTopic } from "./validation";

export async function createForumTopic(
    input: CreateForumTopicInput,
): Promise<string> {
    const supabase = await createClient();
    
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    
}