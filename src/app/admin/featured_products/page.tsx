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
}