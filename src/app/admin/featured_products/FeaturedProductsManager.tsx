"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";

import type { Product, ProductImage } from "@/types/products";
import { getProductImageUrl } from "@/components/admin/products/utils/productImage";

type ProductPrice = {
    id: string;
    amount: number;
    currency: string;
};

type FeaturedProduct = {
    product_id: string;
    position: number;
};

type ManagerProduct = Pick<Product, "id" | "title" | "slug" | "status"> & {
    product_images: ProductImage[] | null;
    product_prices: ProductPrice[] | null;
};

type Props = {
    products: ManagerProduct[];
    initialFeaturedProducts: FeaturedProduct[];
};

function formatPrice(prices: ProductPrice[] | null) {
    const price = prices?.[0];

    if (!price) {
        return "No price set";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currency.toUpperCase(),
    }).format(price.amount / 100);
}

function getImages(images: ProductImage[] | null) {
    if (!images?.length) {
        return null;
    }

    return [...images]
        .filter((image) => image.sort_order >= 0)
        .sort((a, b) => a.sort_order - b.sort_order)[0] ?? null;
}

export default function FeaturedProductsManager({
    products,
    initialFeaturedProducts,
}: Props) {
    const [featuredProducts, setFeaturedProducts] = useState(
        [...initialFeaturedProducts].sort((a, b) => a.position - b.position),
    );
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
    const [savingOrder, setSavingOrder] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const featuredIds = useMemo(
        () => new Set(featuredProducts.map((product) => product.product_id)),
        [featuredProducts],
    );

    const productById = useMemo(
        () => new Map(products.map((product) => [product.id, product])),
        [products],
    );

    const featuredProductDetails = featuredProducts
        .map((featured) => productById.get(featured.product_id))
        .filter((product): product is ManagerProduct => Boolean(product));

    const availableProducts = products.filter(
        (product) => !featuredIds.has(product.id),
    );

    const clearMessages = () => {
        setMessage(null);
        setErrorMessage(null);
    };

    const addProduct = async (productId: string) => {
        clearMessages();
        setLoadingProductId(productId);

        try {
            const response = await fetch("/api/admin/featured-products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Could not feature product.");
            }

            setFeaturedProducts((current) => [
                ...current,
                {
                    product_id: productId,
                    position: current.length,
                },
            ]);

            setMessage("Product added to featured products.");
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Something went wrong.",
            );
        } finally {
            setLoadingProductId(null);
        }

    };

    const removeProduct = async (productId: string) => {
        clearMessages();
        setLoadingProductId(productId);

        try {
            const response = await fetch(
                `/api/admin/featured-products?productId=${encodeURIComponent(productId)}`,
                { method: "DELETE" },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Could not remove product.");
            }

            const updated = featuredProducts
                .filter((product) => product.product_id !== productId)
                .map((product, position) => ({
                    ...product,
                    position,
                }));

            setFeaturedProducts(updated);

            const reorderResponse = await fetch("/api/admin/featured-products", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productIds: updated.map((product) => product.product_id),
                }),
            });

            if (!reorderResponse.ok) {
                throw new Error(
                    "Product was removed, but the new order could not be saved. Refresh the page and try again.",
                );
            }

            setMessage("Product removed from featured products.");
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Something went wrong.",
            );
        } finally {
            setLoadingProductId(null);
        }

    };

    const saveOrder = useCallback(
        async (updated: FeaturedProduct[]) => {
            clearMessages();
            setSavingOrder(true);

            try {
                const response = await fetch("/api/admin/featured-products", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productIds: updated.map((product) => product.product_id),
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error ?? "Could not save product order.");
                }

                setFeaturedProducts(updated);
                setMessage("Featured product order saved.");
            } catch (error) {
                setErrorMessage(
                    error instanceof Error ? error.message : "Something went wrong.",
                );
            } finally {
                setSavingOrder(false);
            }
        },
        [],

    );

    const moveProduct = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;

        if (
            targetIndex < 0 ||
            targetIndex >= featuredProducts.length ||
            savingOrder ||
            loadingProductId
        ) {
            return;
        }

        const updated = [...featuredProducts];

        [updated[index], updated[targetIndex]] = [
            updated[targetIndex],
            updated[index],
        ];

        const normalized = updated.map((product, position) => ({
            ...product,
            position,
        }));

        void saveOrder(normalized);

    };

    return (
        <section className="space-y-10 p-6 text-zinc-100 sm:p-8">
            <header>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                    Homepage
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                    Featured Products
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                    Choose which published products appear in the homepage carousel and
                    control the order in which visitors see them.
                </p>
            </header>

            {message && (
                <div
                    role="status"
                    className="rounded-lg border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300"
                >
                    {message}
                </div>
            )}

            {errorMessage && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300"
                >
                    {errorMessage}
                </div>
            )}

            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold">Homepage carousel</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            {featuredProducts.length} featured{" "}
                            {featuredProducts.length === 1 ? "product" : "products"}
                        </p>
                    </div>

                    {savingOrder && (
                        <span className="text-sm text-zinc-400">Saving order...</span>
                    )}
                </div>

                {featuredProductDetails.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center">
                        <h3 className="font-medium">No featured products yet</h3>
                        <p className="mt-2 text-sm text-zinc-500">
                            Add a published product below to start building your homepage
                            carousel.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {featuredProductDetails.map((product, index) => {
                            const image = getImages(product.product_images);
                            const busy =
                                loadingProductId === product.id || savingOrder;

                            return (
                                <article
                                    key={product.id}
                                    className="
                                    flex flex-col gap-4 rounded-xl border border-zinc-800 
                                    bg-zinc-900/60 p-4 sm:flex-row sm:items-center
                                    "
                                >
                                    <div className="
                                    relative aspect-square w-full shrink-0 
                                    overflow-hidden rounded-lg 
                                    bg-zinc-800 sm:w-24
                                    "
                                    >
                                        {image ? (
                                            <Image
                                                src={getProductImageUrl(image.storage_path)}
                                                alt={image.alt_text ?? product.title}
                                                fill
                                                sizes="96px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full min-h-24 items-center justify-center text-xs text-zinc-500">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="mb-1 text-xs uppercase tracking-wider text-emerald-400">
                                            Featured · #{index + 1}
                                        </p>

                                        <h3 className="truncate font-medium">{product.title}</h3>

                                        <p className="mt-1 text-sm text-zinc-400">
                                            {formatPrice(product.product_prices)}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-zinc-600">
                                            /products/{product.slug}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => moveProduct(index, -1)}
                                            disabled={index === 0 || busy}
                                            aria-label={`Move ${product.title} up`}
                                            className="
                  rounded-lg border border-zinc-700 px-3 py-2 
                  text-sm transition hover:bg-zinc-800 
                  disabled:cursor-not-allowed disabled:opacity-30
                  "
                                        >
                                            ↑
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => moveProduct(index, 1)}
                                            disabled={
                                                index === featuredProductDetails.length - 1 || busy
                                            }
                                            aria-label={`Move ${product.title} down`}
                                            className="
                  rounded-lg border border-zinc-700 px-3 py-2 
                  text-sm transition hover:bg-zinc-800 
                  disabled:cursor-not-allowed disabled:opacity-30
                  "
                                        >
                                            ↓
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => void removeProduct(product.id)}
                                            disabled={busy}
                                            className="
                  rounded-lg border border-red-900 px-3 py-2 
                  text-sm text-red-300 transition 
                  hover:bg-red-950/50 disabled:cursor-not-allowed 
                  disabled:opacity-50
                  "
                                        >
                                            {loadingProductId === product.id ? "Removing..." : "Remove"}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Available products</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Only published products can be added to the homepage carousel.
                    </p>
                </div>

                {availableProducts.length === 0 ? (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-400">
                        All published products are already featured, or no published
                        products are available.
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {availableProducts.map((product) => {
                            const image = getImages(product.product_images);
                            const busy =
                                loadingProductId === product.id || savingOrder;

                            return (
                                <article
                                    key={product.id}
                                    className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60"
                                >
                                    <div className="relative aspect-16/10 bg-zinc-800">
                                        {image ? (
                                            <Image
                                                src={getProductImageUrl(image.storage_path)}
                                                alt={image.alt_text ?? product.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                                                No image available
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 p-4">
                                        <div>
                                            <h3 className="truncate font-medium">{product.title}</h3>
                                            <p className="mt-1 text-sm text-zinc-400">
                                                {formatPrice(product.product_prices)}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => void addProduct(product.id)}
                                            disabled={busy}
                                            className="
                  w-full rounded-lg bg-white px-4 py-2.5 
                  text-sm font-medium text-zinc-950 
                  transition hover:bg-zinc-200 
                  disabled:cursor-not-allowed 
                  disabled:opacity-50
                  "
                                        >
                                            {loadingProductId === product.id
                                                ? "Adding..."
                                                : "Add to homepage"}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </section>

    );
}

