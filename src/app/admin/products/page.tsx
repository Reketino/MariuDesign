import Link from "next/link";

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
        )
        `)
        .order("created_at", {
            ascending: false,
        });

        if (error) {
            throw new Error(
                `Failed to load products: ${error.message}`,
            )
        }

        return (
            <section className="space-y-8">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-500">
                        Store 🛒
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                        Products 📦
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                        Manage the 3D models available in your store. 
                    </p>
                </div>

                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                >
                    Add product 📦
                </Link>
            </header>
            </section>
        );
}