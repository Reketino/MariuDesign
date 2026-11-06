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

    const productList = products ?? [];

    const publishedProducts = productList.filter(
        (product) => product.status === "published"
    ).length;

    const draftProducts = productList.filter(
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
                    <article className="rounded-xl border border-white/[0.07] bg-[#111111] p-5">
                    <p className="text-sm text-zinc-400">
                        Total products
                    </p>

                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white tabular-nums">
                        {String(productList.length).padStart(2, "0")}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                        Products in your catalog
                    </p>
                    </article>

                    <article className="rounded-xl border border-white/[0.07] bg-[#111111] p-5">
                    <p className="text-sm text-zinc-400">
                        Published
                    </p>

                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white tabular-nums">
                        {String(publishedProducts).padStart(2, "0")}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                        Visible in your store
                    </p>
                    </article>

                    <article className="rounded-xl border border-white/[0.07] bg-[#111111] p-5">
                    <p className="text-sm text-zinc-400">
                        Drafts
                    </p>

                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white tabular-nums">
                        {String(draftProducts).padStart(2, "0")}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                        Not yet published
                    </p>
                    </article>
                </div>
            </section>

            <section className="product-list-heading">
                <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2
                        id="product-list-heading"
                        className="text-sm font-medium text-zinc-200"
                        >
                            Product catalog
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            View and manage all your products.
                        </p>
                    </div>

                    <span className="w-fit rounded-full border border-white/8 px-3 py-1 text-xs text-zinc-500">
                    {productList.length}{" "}
                    {productList.length === 1 ? "product" : "products"}
                    </span>
                </header>
        
        
            <ProductTable products={products ?? []} />
            </section>
        </main>
    );
}