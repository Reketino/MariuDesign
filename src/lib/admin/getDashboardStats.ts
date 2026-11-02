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
        supabase
        .from("products")
        .select("id", { count: "exact", head: true }),
    ])
}