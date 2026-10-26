import "server-only";

import { supabaseAdmin } from "../supabase/admin";

export async function getFeaturedProducts() {
    const { data, error } = await supabaseAdmin
    .from("homepage_featured_products")
    .select(`position,
        products!inner(
        id,
        title,
        slug,
        description,
        status,
        categories(id, name, slug),
        product_images(id, storage_path, alt_text, sort_order),
        product_prices(id, amount, currency)
        )
        `)
        .eq("products.status", "published")
        .order("positions", { ascending: true });

        if (error) {
            console.error("Failed to fetch featured prodiucts:", error);
            return [];
        }
        
}
