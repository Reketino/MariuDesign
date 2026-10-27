"use client";

import { useRouter } from "next/navigation";

import CircularCarousel from "@/components/CircularCarousel";
import type { CircularCarouselItem } from "@/components/CircularCarousel";
import {
    getProductImage,
    getProductImageUrl,
} from "@/components/admin/products/utils/productImage";

type FeaturedProduct = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    position: number;
    product_images: {
        id: string;
        product_id: string;
        storage_path: string;
        alt_text: string | null;
        sort_order: number;
    }[];
    product_prices: {
        id: string;
        amount: number;
        currency: string;
    }[];
};

type FeaturedProductsProps = {
    products: FeaturedProduct[];
};

export default function FeaturedProducts({
    products,
}: FeaturedProductsProps) {
    const router = useRouter();

    const productsWithImages = products.flatMap((product) => {
        const mainImage = getProductImage(product.product_images);

        if (!mainImage) {
            return [];
        }

        const price = product.product_prices[0];

        const item: CircularCarouselItem = {
            src: getProductImageUrl(mainImage.storage_path),
            alt: mainImage.alt_text ?? product.title,
            title: product.title,
            subtitle: price
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: price.currency.toUpperCase(),
                }).format(price.amount)
                : undefined,
        };

        return [{ product, item }];
    });

    if (productsWithImages.length === 0) {
        return null;
    }

    const items = productsWithImages.map(({ item }) => item);

    return (
        <section className="w-full bg-black px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
                            Curated collection
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Featured designs
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push("/shop")}
                        className="shrink-0 text-sm text-zinc-400 transition hover:text-white"
                    >
                        View all products
                    </button>
                </div>

                <div className="h-110 w-full sm:h-130">
                    <CircularCarousel
                        items={items}
                        preset="cylinder"
                        autoplay="drift"
                        speed={0.3}
                        pauseOnHover
                        draggable
                        captions
                        onItemClick={(_, index) => {
                            const selectedProduct = productsWithImages[index]?.product;

                            if (selectedProduct) {
                                router.push(`/products/${selectedProduct.slug}`);
                            }
                        }}
                    />
                </div>
            </div>
        </section>
    );
}