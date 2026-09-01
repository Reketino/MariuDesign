"use client";

import type { ProductCategory } from "@/types/products";

type ProductStoreSettingsProps = {
    categories: ProductCategory[];
    categoryId: string;
    status: string;
    license: string;
    onCategoryChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onLicenseChange: (value: string) => void;
};