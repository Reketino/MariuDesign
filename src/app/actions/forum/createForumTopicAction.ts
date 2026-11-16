"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createForumTopic } from "@/lib/forum/createForumTopic";

type CreateForumTopicActionResult =
  | { success: true; topicId: string }
  | { success: false; error: string };

export async function createForumTopicAction(
  formData: FormData,
): Promise<CreateForumTopicActionResult> {
  const categoryId = formData.get("categoryId");
  const productId = formData.get("productId");
  const title = formData.get("title");
  const content = formData.get("content");

  if (
    typeof categoryId !== "string" ||
    typeof title !== "string" ||
    typeof content !== "string"
  ) {
    return {
      success: false,
      error: "Invalid form data.",
    };
  }

  if (productId !== null && typeof productId !== "string") {
    return {
      success: false,
      error: "Invalid product selection.",
    };
  }

  try {
    const topicId = await createForumTopic({
      category_id: categoryId,
      product_id: productId || null,
      title,
      content,
    });

    revalidatePath("/forum");

    return {
      success: true,
      topicId,
    };
  } catch (error) {
    console.error("Failed to create forum topic:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the topic.",
    };
  }
}
