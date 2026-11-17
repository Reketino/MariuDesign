"use server";

import { revalidatePath } from "next/cache";

import { createForumReply } from "@/lib/forum/createForumReply";

type CreateForumReplyActionResult =
  | { success: true; replyId: string }
  | { success: false; error: string };

export async function createForumReplyAction(
  formData: FormData,
): Promise<CreateForumReplyActionResult> {
  const topicId = formData.get("topicId");
  const content = formData.get("content");

  if (typeof topicId !== "string" || typeof content !== "string") {
    return {
      success: false,
      error: "Invalid form data.",
    };
  }

  try {
    const replyId = await createForumReply({
      topic_id: topicId,
      content,
    });

    revalidatePath("/forum");
    revalidatePath(`/forum/topic/${topicId}`);

    return {
      success: true,
      replyId,
    };
  } catch (error) {
    console.error("Failed to create forum reply:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the reply.",
    };
  }
}
