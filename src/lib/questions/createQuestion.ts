import { createClient } from "@/lib/supabase/server";
import { validateQuestion } from "./validation";

import type { CreateProductQuestionInput } from "@/types/questions";

type CreateQuestionResult =
  | {
      success: true;
      questionId: string;
    }
  | {
      success: false;
      error: string;
    };

export async function createQuestion(
  input: CreateProductQuestionInput,
): Promise<CreateQuestionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "You must be logged in to ask question.",
    };
  }

  const validation = validateQuestion(input.title, input.content);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error,
    };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("id", input.product_id)
    .eq("status", "published")
    .maybeSingle();

  if (productError || !product) {
    return {
      success: false,
      error: "Product not found or unavailable.",
    };
  }

  const { data, error } = await supabase
    .from("product_questions")
    .insert({
      product_id: input.product_id,
      user_id: user.id,
      title: input.title.trim(),
      content: input.content.trim(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create product questions:", error);

    return {
      success: false,
      error: "Could not create your question. Please try again.",
    };
  }

  return {
    success: true,
    questionId: data.id,
  };
}
