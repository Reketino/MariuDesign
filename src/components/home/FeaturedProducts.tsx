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

export default function FeaturedProduct({
    products,
}: FeaturedProductsProps) {
    const router = useRouter();

    const items: CircularCarouselItem[] = products.flatMap((product) => {
        const mainImage = getProductImage(product.product_images);

        if (!mainImage) {
            return[];
        }

        const price = product.product_prices[0];

        return [
            {
                src: getProductImageUrl(mainImage.storage_path),
                alt: mainImage.alt_text ?? product.title,
                title: product.title,
                subtitle: price
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: price.currency.toUpperCase(),
                }).format(price.amount)
                : undefined,
            },
        ];
    });

    if (items.length === 0) {
        return null;
    }

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
                </div>
            </div>
        </section>
    )
}