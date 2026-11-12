import { createClient } from "@/lib/supabase/server";
import { validateAnswer } from "./validation";

import type { CreateProductAnswerInput } from "@/types/questions";

type CreateAnswerResult =
  | {
      success: true;
      questionId: string;
    }
  | {
      success: false;
      error: string;
    };

    export async function createAnswer(
        input: CreateProductAnswerInput,
    ): Promise<CreateAnswerResult> {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                success: false,
                error: "You must be logged in to answer a question."
            };
        }

        const validation = validateAnswer(input.content);

        
    }