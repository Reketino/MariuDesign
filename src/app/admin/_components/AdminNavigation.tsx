"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationGroups = [
    {
        label: "Workspace",
        items: [
            {
                label: "Dashboard",
                href: "/admin",
                icon: "dashboard",
            },
        ],
    },
    {
        label: "Store",
        items: [
            {
                label: "Products",
                href: "/admin/products",
                icon: "products",
            },
            {
                label: "Featured Products",
                href: "/admin/featured-products",
                icon: "featured",
            },
            {
                label: "Categories",
                href: "/admin/categories",
                icon: "categories",
            },
            {
                label: "Orders",
                href: "/admin/orders",
                icon: "orders",
            },
            {
                label: "Documents",
                href: "/admin/documents",
                icon: "documents",
            },

        ]
    }
]