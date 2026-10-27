import "server-only";

import { supabaseAdmin } from "../supabase/admin";

export async function getFeaturedProducts() {
  const { data, error } = await supabaseAdmin
    .from("homepage_featured_products")
    .select(
      `position,
        products!inner(
        id,
        title,
        slug,
        description,
        status,
        categories(id, name, slug),
        product_images(id, product_id, storage_path, alt_text, sort_order),
        product_prices(id, amount, currency)
        )
        `,
    )
    .eq("products.status", "published")
    .order("position", { ascending: true });

  if (error) {
    console.error("Failed to fetch featured prodiucts:", error);
    return [];
  }

  return (data ?? []).flatMap((item) =>
    (item.products ?? []).map((product) => ({
      ...product,
      position: item.position,
      product_images: [...(product.product_images ?? [])].sort(
        (a, b) => a.sort_order - b.sort_order,
      ),
      product_prices: product.product_prices ?? [],
    })),
  );
}
