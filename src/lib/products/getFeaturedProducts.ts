import "server-only";

import { supabaseAdmin } from "../supabase/admin";

export async function getFeaturedProducts() {
  const { data, error } = await supabaseAdmin
    .from("homepage_featured_products")
    .select(
      `
        position,
        products!inner (
            id,
            title,
            slug,
            description,
            status,
            product_images (
                id,
                product_id,
                storage_path,
                alt_text,
                sort_order
            ),
            product_prices (
                id,
                amount,
                currency
            )
        )
    `,
    )

    .eq("products.status", "published")
    .order("position", { ascending: true });

  if (error) {
    console.error("Failed to fetch featured prodiucts:", error);
    return [];
  }

  return (data ?? []).flatMap((item) => {
    const products = Array.isArray(item.products)
      ? item.products
      : item.products
        ? [item.products]
        : [];

    return products.map((product) => ({
      ...product,
      product_images: [...(product.product_images ?? [])].sort(
        (a, b) => a.sort_order - b.sort_order,
      ),
      product_prices: product.product_prices ?? [],
    }));
  });
}
