import { createClient } from "@/lib/supabase/server";

import type { CreateForumReplyInput } from "@/types/forum";

import { validateForumReply } from "./validation";
