import { createClient } from "@/lib/supabase/server";
import { validateAnswer } from "./validation";

import type { CreateProductAnswerInput } from "@/types/questions";

type CreateAnswerResult =
  | {
      success: true;
      answerId: string;
    }
  | {
      success: false;
      error: string;
    };

export async function createAnswer(
  input: CreateProductAnswerInput,
): Promise<CreateAnswerResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "You must be logged in to answer a question.",
    };
  }

  const validation = validateAnswer(input.content);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error,
    };
  }

  const { data: question, error: questionError } = await supabase
    .from("product_questions")
    .select("id")
    .eq("id", input.question_id)
    .eq("is_hidden", false)
    .maybeSingle();

  if (questionError || !question) {
    return {
      success: false,
      error: "Question not found or unavailable.",
    };
  }

  const { data, error } = await supabase
    .from("product_answers")
    .insert({
      question_id: input.question_id,
      user_id: user.id,
      content: input.content.trim(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create product answer:", error);

    return {
      success: false,
      error: "Could not submit your answer. Please try again.",
    };
  }

  return {
    success: true,
    answerId: data.id,
  };
}
