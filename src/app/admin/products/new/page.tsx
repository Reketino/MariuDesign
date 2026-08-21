import Link from "next/link";

import ProductForm from "@/components/admin/products/ProductForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewProductPage() {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");

    if (error) {
        throw new Error("Failed to load product categories");
    }

    return (
        <section className="space-y-8">
            <header>
                <Link
                    href="/admin/products"
                    className="text-sm text-zinc-500 transition hover:text-white"
                >
                    ← Back to products
                </Link>

                <p className="mt-6 text-sm font-medium text-zinc-500">
                    Store
                </p>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                    Add product 🛠️
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                    Create a new 3D model for Reites aka MariuDesign store.
                </p>
            </header>

            <ProductForm categories={categories ?? []} />
        </section>
    );
}