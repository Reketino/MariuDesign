import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import type {
    ProductFile,
    ProductImage,
} from "@/types/products";

import {
    getProductImages,
    getProductImageUrl,
} from "@/components/admin/products/utils/productImage";

type ProductPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

type ProductDetails = {
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
    product_prices: {
        id: string;
        product_id: string;
        currency: string;
        amount: number;
        created_at: string;
    }[] | null;
    product_files: ProductFile[] | null;
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
        ),
        product_prices (
            id,
            product_id,
            currency,
            amount,
            created_at
        ),
        product_files (
        id,
        product_id,
        file_type,
        file_name,
        storage_path,
        version,
        created_at
        )
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (error || !product) {
        notFound();
    }

    const productDetails = product as ProductDetails;

    const images = getProductImages(
        productDetails.product_images,
    );

    const mainImage = images[0] ?? null;

    const category =
        productDetails.categories?.[0] ?? null;

    const price =
        productDetails.product_prices?.[0] ?? null;

    const ProductFiles =
        productDetails.product_files ?? [];

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
                            className="text-sm text-zinc-400 transition hover:text-white">
                            Home
                        </Link>

                        <Link
                            href="/shop"
                            className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            Shop
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

            <section className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
                <div className="mb-8">
                    <Link
                    href="/shop"
                    className="text-sm text-zinc-500 transition hover:text-zinc-500"
                    >
                        ← Back to shop
                    </Link>
                </div>

                <div className="grid gap-12 lg:grid-cols-2 lg: itgems-start">
                    <section aria-label="Product images">
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                            {mainImage ? (
                                <Image
                                src={getProductImageUrl(
                                    mainImage.storage_path,
                                )}
                                alt={
                                    mainImage.alt_text ??
                                    productDetails.title
                                }
                                fill
                                priority
                                sizes="(min-width: 1024px) 50vw, 100vw"
                                className="object-cover"
                                />
                            ): (
                                <div className="flex h-full items-center justify-center text-sm text-zinc-600">
                                    No image avaliable
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="mt-4 grid grid-cols-4 gap-3">
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
                                            productDetails.title
                                        }
                                        fill
                                        sizes="(min-width: 1024px) 12vw, 25vw"
                                        className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        {category && (
                            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                                {category.name}
                            </p>
                        )}

                        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                            {productDetails.title}
                        </h1>

                        {price && (
                            <p className="mt-6 text-2xl font-medium text-white">
                                {Number(price.amount).toFixed(2)}{" "}
                                {price.currency}
                            </p>
                        )}

                        {productDetails.description && (
                            <div className="mt-8 border-t border-zinc-800 pt-8">
                                <h2 className="text-sm font-medium text-white">
                                    About this design
                                </h2>

                                <p className="mt-3 whitespace-pre-line text-base leading-7 text-zinc-400">
                                    {productDetails.description}
                                </p>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                        <h2 className="text-sm font-medium text-white">
                            Digital download
                        </h2>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    )
}