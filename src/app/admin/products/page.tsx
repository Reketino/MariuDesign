import Link from "next/link";

import ProductTable from "@/components/admin/products/ProductTable";
import { createClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from("products")
        .select(`
        id,
        title,
        slug,
        description,
        status,
        license,
        created_at,
        category_id,
        
        categories (
        id,
        name,
        slug
        ),

        product_images(
        id,
        product_id,
        storage_path,
        alt_text,
        sort_order
        )
        `)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        console.error("Failed to fetch products:", error);
        throw new Error("Failed to load products");
    }

    const productsList = products ?? [];

    const publishedProducts = productsList.filter(
        (product) => product.status === "published"
    ).length;

    const draftProducts = productsList.filter(
        (product) => product.status === "draft"
    ).length;

    return (
        <main className="space-y-9 pb-12">
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Store managment 🛒
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                        Products 📦
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                        Manage your 3D models, product information and 
                        publishing status.
                    </p>
                </div>

                <Link
                    href="/admin/products/new"
                    className="
                    inline-flex w-fit items-center 
                    gap-2 rounded-lg bg-white px-4 py-2.5 
                    text-sm font-medium text-zinc-950 
                    transition hover:bg-zinc-200
                    "
                >
                    <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-4"
                    >
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    
                    Add product 📦
                </Link>
            </header>

            <section aria-label="Product statistics">
                <div className="grid gap-3 sm:grid-cols-3">
                    
                </div>
            </section>

            <ProductTable products={products ?? []} />
        </main>
    );
}