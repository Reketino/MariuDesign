
"use server";

import { revalidatePath } from "next/cache";

import { createForumReply } from "@/lib/forum/createForumReply";

type CreateForumReplyActionRessult =
| { success: true, replyId: string }
| { success: false; error: string };
