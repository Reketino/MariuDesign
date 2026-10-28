import { createClient } from "@/lib/supabase/server";
import { title } from "process";

export const dynamic = "force-dynamic";

export default async function FeaturedProductsPage() {
    const supabase = await createClient();

    const { data:products, error } = await supabase
    .from("products")
    .select(`id, title, slug, status,
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
   `)
.eq("status", "published")
.order("created_at", { ascending: false });

if (error) {
    console.error("Failed to fetch products:", error);

    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-white">
          Featured Products
        </h1>
        <p className="mt-4 text-red-400">
          Could not load products. Please try again later.
        </p>
      </div>
    );
}

const { data: FeaturedProducts, error: featuredError } = await supabase
.from("homepage_featured_products")
.select("product_id, position")
.order("position", { ascending: true });

if (featuredError) {
  console.error("Failed to fetch featured products:", featuredError);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white">
        Featured Products
      </h1>
      <p className="mt-4 text-red-400">
        Could not load featured products. Please try again later.
      </p>
    </div>
  );
}


}