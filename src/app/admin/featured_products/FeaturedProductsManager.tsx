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
}
