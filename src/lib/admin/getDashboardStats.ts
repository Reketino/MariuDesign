
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

        supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("status", "published"),

        supabase
            .from("categories")
            .select("id", { count: "exact", head: true }),

        supabase
            .from("orders")
            .select("id", { count: "exact", head: true }),

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

    const queryResults = [
        { name: "products", result: productsResult },
        { name: "publishedProducts", result: publishedProductsResult },
        { name: "categories", result: categoriesResult },
        { name: "orders", result: ordersResult },
        { name: "paidOrders", result: paidOrdersResult },
        { name: "pendingOrders", result: pendingOrdersResult },
        { name: "buildGuides", result: buildGuidesResult },
        { name: "partLists", result: partListsResult },
    ];

    const failedQueries = queryResults.filter(
        ({ result }) => result.error
    );

    if (failedQueries.length > 0) {
        for (const { name, result } of failedQueries) {
            console.error("Dashboard query failed:", {
                query: name,
                error: result.error,
                errorString: String(result.error),
                errorJson: JSON.stringify(result.error),
            });
        }

        throw new Error(
            `Dashboard queries failed: ${failedQueries
                .map(({ name }) => name)
                .join(", ")}`
        );
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
