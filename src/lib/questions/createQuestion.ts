import { createClient } from "@/lib/supabase/server";
import { validateQuestion } from "./validation";

import type { CreateProductQuestionInput } from "@/types/questions";
import { Content } from "next/font/google";

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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

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
    }
}