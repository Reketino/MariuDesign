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
        ],
    },
] as const;

type navigationIcon =
(typeof navigationGroups)[number]["items"][number]["icon"];

function navigationIcon({
    name,
}: {
    name: NavigationIconName;
}) {
const icons = {
    dashboard: (
        <>
            <rect x="3" y="3" width="8" height="8" rx="1.5" />
            <rect x="13" y="3" width="8" height="5" rx="1.5" />
            <rect x="13" y="10" width="8" height="11" rx="1.5" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" />
        </>
    ),
    products: (
        <>
            <path d="m12 3 9 5-9 5-9-5 9-5Z" />
            <path d="m3 8 9 5 9-5M3 8v8l9 5 9-5V8" />
        </>
    )
}
}