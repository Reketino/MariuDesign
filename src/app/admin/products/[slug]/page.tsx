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
                
            </main>
        )
}