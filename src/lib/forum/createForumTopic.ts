import { createClient } from "@/lib/supabase/server";

import type { CreateForumTopicInput } from "@/types/forum";

import { validateForumTopic } from "./validation";

export async function createForumTopic(
    input: CreateForumTopicInput,
): Promise<string> {
    const supabase = await createClient();
    
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("You must be logged in to create a topic.");
    }

    const validation = validateForumTopic(input.title, input.content);

    if (!validation.success) {
        throw new Error(validation.error);
    }

    const { data: category, error: categoryError } = await supabase
    .from("forum_categories")
    .select("id")
    .eq("id", input.category_id)
    .eq("is_active", true)
    .maybeSingle();

    if (categoryError) {
        console.error("Failed to validate forum category:", categoryError);
        throw new Error("Could not validate forum category.");
    }

    if (!category) {
        throw new Error("The selected forum category is not available.");
    }

      if (input.product_id) {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", input.product_id)
      .eq("status", "published")
      .maybeSingle();

      if (productError) {
        console.error("Failed to validate forum product:", productError);
        throw new Error("Could not validate forum product.");
      }

      if (!product) {
        throw new Error("The selected product is not available.");
      }
}


}