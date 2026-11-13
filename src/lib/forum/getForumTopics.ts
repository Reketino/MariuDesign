
import { createClient } from "@/lib/supabase/server";

import type { ForumTopicWithReplies } from "@/types/forum";

type GetForumTopicsOptions = {
categoryId?: string;
limit?: number;
};