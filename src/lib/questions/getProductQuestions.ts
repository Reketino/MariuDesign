import { createClient } from "@/lib/supabase/server";
import type { ProductQuestionWithAnswers } from "@/types/questions";

export async functin getProductQuestions(
    productId: string,
): Promise<ProductQuestionWithAnswers[]> {
    const supabase = await createClient();
}
