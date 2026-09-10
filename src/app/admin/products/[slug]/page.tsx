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
}