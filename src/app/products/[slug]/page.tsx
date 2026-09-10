import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import type { ProductImage } from "@/types/products";

import { getProductImageUrl } from "@/components/admin/products/utils/productImage";

type ProductPageData = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    license: string | null;
    categories: {
        id: string;
        name: string;
        slug: string;
    }[] | null;
    product_images: ProductImage[] | null;
};

type ProductPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ProductPage({
    params,
}: ProductPageProps) {
    const { slug } = await params;

    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from("products")
        .select(`
            id,
            title,
            slug,
            description,
            license,
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
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (error || !product) {
        notFound();
    }

    const productData = product as ProductPageData;

    const images = [...(productData.product_images ?? [])]
        .filter((image) => image.sort_order >= 0)
        .sort((a, b) => a.sort_order - b.sort_order);

    const mainImage = images[0] ?? null;
    const category = productData.categories?.[0] ?? null;

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
                            href="/shop"
                            className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            Store
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

            <section className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
                <Link
                    href="/shop"
                    className="text-sm text-zinc-500 transition hover:text-zinc-300"
                >
                    ← Back to store
                </Link>

                <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                            {mainImage ? (
                                <Image
                                    src={getProductImageUrl(
                                        mainImage.storage_path,
                                    )}
                                    alt={
                                        mainImage.alt_text ??
                                        productData.title
                                    }
                                    fill
                                    priority
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-zinc-600">
                                    No image available
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="mt-4 grid grid-cols-4 gap-4">
                                {images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                                    >
                                        <Image
                                            src={getProductImageUrl(
                                                image.storage_path,
                                            )}
                                            alt={
                                                image.alt_text ??
                                                productData.title
                                            }
                                            fill
                                            sizes="160px"
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <article className="flex flex-col">
                        {category && (
                            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                                {category.name}
                            </p>
                        )}

                        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                            {productData.title}
                        </h1>

                        {productData.description && (
                            <div className="mt-6">
                                <p className="whitespace-pre-line text-base leading-8 text-zinc-400">
                                    {productData.description}
                                </p>
                            </div>
                        )}

                        <div className="mt-10 border-t border-zinc-800 pt-6">
                            <dl className="space-y-4">
                                {category && (
                                    <div className="flex items-center justify-between gap-6">
                                        <dt className="text-sm text-zinc-500">
                                            Category
                                        </dt>
                                        <dd className="text-sm text-zinc-300">
                                            {category.name}
                                        </dd>
                                    </div>
                                )}

                                {productData.license && (
                                    <div className="flex items-center justify-between gap-6">
                                        <dt className="text-sm text-zinc-500">
                                            License
                                        </dt>
                                        <dd className="text-sm capitalize text-zinc-300">
                                            {productData.license}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="mt-10">
                            <button
                                type="button"
                                disabled
                                className="w-full rounded-lg bg-white px-5 py-3.5 text-sm font-medium text-zinc-950 opacity-50"
                            >
                                Download model
                            </button>

                            <p className="mt-3 text-center text-xs text-zinc-600">
                                Downloads will be available soon.
                            </p>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    );
}