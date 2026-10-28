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