import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();

  const [
    productsResult,
    publishedProductsResult,
    categoriesResult,
    ordersResult,
    paidOrdersResult,
    pendingOrdersResult,
    buildGuidesResult,
    partListsResult,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),

    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),

    supabase.from("categories").select("id", { count: "exact", head: true }),

    supabase.from("orders").select("id", { count: "exact", head: true }),

    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid"),

    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("product_documents")
      .select("id", { count: "exact", head: true })
      .eq("document_type", "build_guide"),

    supabase
      .from("product_documents")
      .select("id", { count: "exact", head: true })
      .eq("document_type", "part_list"),
  ]);
}
