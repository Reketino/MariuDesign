"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createForumTopic } from "@/lib/forum/createForumTopic";

type createForumTopicActionResult =
| { success: true; topicId: string }
| { success: false; error: string };

export async function createForumTopicAction(
    formData: FormData,
): Promise<createForumTopicActionResult> {
    
}