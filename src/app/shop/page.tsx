import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import type { ProductImage } from "@/types/products";

import { getProductImageUrl } from "@/components/admin/products/utils/productImage";

type ShopProduct = {
    id: string;
    title: string;
    slug: string;
    categories: {
        id: string;
        name: string;
        slug: string;
    }[] | null;
    product_images: ProductImage[] | null;
};

export default async function ShopPage() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from("products")
        .select(`
            id,
            title,
            slug,
            categories (
                id,
                name,
                slug
            ),
            product_images (
                id,
                product_id,
                storage_path,
                alt_text,
                sort_order
            )
        `)
        .eq("status", "published")
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw new Error(
            `Failed to load products: ${error.message}`,
        );
    }

    const shopProducts = (products ?? []) as ShopProduct[];

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <header className="border-b border-zinc-800">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight"
                    >
                        Mariudesign
                    </Link>

                    <nav
                        aria-label="Main navigation"
                        className="flex items-center gap-6"
                    >
                        <Link
                            href="/"
                            className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            Home
                        </Link>

                        <Link
                            href="/login"
                            className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            Log in
                        </Link>
                    </nav>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
                <header className="max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        Store
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        Browse designs.
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-400">
                        Explore 3D printable models designed by
                        Mariudesign.
                    </p>
                </header>

                {shopProducts.length === 0 ? (
                    <div className="mt-16 rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-16 text-center">
                        <h2 className="text-lg font-medium text-white">
                            No designs available yet.
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                            New 3D printable designs will appear here
                            once they are published.
                        </p>
                    </div>
                ) : (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {shopProducts.map((product) => {
                            const productImage =
                                product.product_images
                                    ?.filter(
                                        (image) =>
                                            image.sort_order >= 0,
                                    )
                                    .sort(
                                        (a, b) =>
                                            a.sort_order -
                                            b.sort_order,
                                    )[0] ?? null;

                            const category =
                                product.categories?.[0] ?? null;

                            return (
                                <article
                                    key={product.id}
                                    className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 transition hover:border-zinc-700 hover:bg-zinc-900/70"
                                >
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="block"
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-zinc-950">
                                            {productImage ? (
                                                <Image
                                                    src={getProductImageUrl(
                                                        productImage.storage_path,
                                                    )}
                                                    alt={
                                                        productImage.alt_text ??
                                                        product.title
                                                    }
                                                    fill
                                                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                                    className="object-cover transition duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-sm text-zinc-600">
                                                    No image
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            {category && (
                                                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                                                    {category.name}
                                                </p>
                                            )}

                                            <h2 className="mt-2 text-lg font-medium text-white">
                                                {product.title}
                                            </h2>

                                            <p className="mt-2 text-sm text-zinc-500">
                                                View product
                                            </p>
                                        </div>
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}