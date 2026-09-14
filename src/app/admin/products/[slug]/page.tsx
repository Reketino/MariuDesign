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
