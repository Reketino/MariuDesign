import { createClient } from "@/lib/supabase/server";
import type { ProductQuestionWithAnswers } from "@/types/questions";


export async functin getProductQuestions(
    productId: string,
): Promise<ProductQuestionWithAnswers[]> {
    const supabase = await createClient(),

    const { data, error } = await supabase
     .from("product_questions")
    .select(`
      id,
      product_id,
      user_id,
      title,
      content,
      is_hidden,
      created_at,
      updated_at,
      product_answers (
        id,
        question_id,
        user_id,
        content,
        is_official,
        is_hidden,
        created_at,
        updated_at
      )
    `)
    .eq("product_id", productId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

    
}
