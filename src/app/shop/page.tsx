import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

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
    products_images: ProductImage[] | null;
};

export default async function ShopPage() {
    const supabase = await createClient();
}