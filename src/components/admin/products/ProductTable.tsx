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

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
}

function getStatusClasses(status: string) {
    switch(status.toLowerCase()) {
        case "published": 
        return "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20";

        case "draft":
            return "bg-zinc-800 text-zinc-400 ring-1 ring-inset ring-zinc-700";

        case "archived":
            return "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20";
    }
}
