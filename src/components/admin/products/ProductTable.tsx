import Link from "next/link";

import type { Product, ProductCategory } from "@/types/products";

type ProductTableProps = {
    products: Product[];
};

function getCategory(
    categories: Product["categories"],
): ProductCategory | null {
    if (!categories) {
        return null;
    }

    if (Array.isArray(categories)) {
        return categories[0] ?? null;
    }

    return categories;
}
