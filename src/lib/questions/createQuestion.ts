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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return {
            success: false,
            error: "You must be logged in to ask question.",
        };
    }

    
}