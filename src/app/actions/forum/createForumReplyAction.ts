
"use server";

import { revalidatePath } from "next/cache";

import { createForumReply } from "@/lib/forum/createForumReply";

type CreateForumReplyActionResult =
| { success: true, replyId: string }
| { success: false; error: string };

export async function createForumReplyAction(
    formData: FormData,
): Promise<CreateForumReplyActionResult> {
    
}