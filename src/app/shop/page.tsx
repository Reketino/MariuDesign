import Image from "next/image";
import Link from "next/link";

import { getSupabaseServerClient } from "@/lib/supabase";

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
