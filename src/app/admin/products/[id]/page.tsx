import Link from "next/link";

import ProductForm from "@/components/admin/products/ProductForm";

import { createClient } from "@/lib/supabase/server";

type EditProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params;

    const supabase = await createClient();

    const [
        { data: product, error: productError },
        { data: categories, error: categoriesError },
    ] = await Promise.all([
        supabase
            .from("products")
            .select(`
                id,
                title,
                slug,
                description,
                status,
                license,
                category_id
                product_images (
                    id,
                    storage_path,
                    alt_text,
                    sort_order
                )
            `)
            .eq("id", id)
            .single(),

        supabase
            .from("categories")
            .select("id, name, slug")
            .order("name"),
    ]);

    if (productError || !product) {
        throw new Error("Product not found");
    }

    if (categoriesError) {
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
                    Store 🛒
                </p>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                    Edit product ⚙️
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                    Update the information for this 3D model.
                </p>
            </header>

            <ProductForm
                categories={categories ?? []}
                product={product}
            />
        </section>
    );
}