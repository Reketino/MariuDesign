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

  const result = [
    productsResult,
    publishedProductsResult,
    categoriesResult,
    ordersResult,
    paidOrdersResult,
    pendingOrdersResult,
    buildGuidesResult,
    partListsResult,
  ];

  const failedQuery = result.find((result) => result.error);

  if (failedQuery?.error) {
    console.error("Failed to fetch dashboard statistics:", failedQuery.error);
    throw new Error("Could not load dashboard statistics.");
  }

  return {
    products: productsResult.count ?? 0,
    publishedProducts: publishedProductsResult.count ?? 0,
    categories: categoriesResult.count ?? 0,
    orders: ordersResult.count ?? 0,
    paidOrders: paidOrdersResult.count ?? 0,
    pendingOrders: pendingOrdersResult.count ?? 0,
    buildGuides: buildGuidesResult.count ?? 0,
    partLists: partListsResult.count ?? 0,
  };
}
