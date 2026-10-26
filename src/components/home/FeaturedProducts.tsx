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