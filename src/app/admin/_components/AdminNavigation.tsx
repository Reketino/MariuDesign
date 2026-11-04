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

type NavigationIconName =
(typeof navigationGroups)[number]["items"][number]["icon"];

function NavigationIcon({
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
    ),
    featured: (
        <>
            <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
        </>
    ),
    categories: (
        <>
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
    ),
    orders: (
        <>
                <path d="M6 2h9l5 5v15H6z" />
                <path d="M14 2v6h6M9 13h8M9 17h8" />
        </>
    ),
    documents: (
        <>
                <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path d="M14 3v6h5M9 13h7M9 17h7" />
        </>
    ),
    settings: (
        <>
                <circle cx="12" cy="12" r="3" />
                <path d="
                m19.4 15 .1.1a1.7 1.7 0 1 1-2.4 2.4l-.1-.1a1.7 
                1.7 0 0 0-2.9 1.2v.4a1.7 1.7 0 1 1-3.4 0v-.2a1.7 
                1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.7 
                1.7 0 0 0-1.2-2.9h-.4a1.7 1.7 0 1 1 0-3.4h.2a1.7 
                1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.7 
                1.7 0 0 0 2.9-1.2v-.4a1.7 1.7 0 1 1 3.4 0v.2a1.7 1.7 0 
                0 0 2.9 1.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.7 1.7 
                0 0 0 1.2 2.9h.4a1.7 1.7 0 1 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z
                " 
                />

        </>
    ),
};

return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-4.5 shrink-0"
        >
            {icons[name]}
        </svg>
);
}

function isActiveRoute(pathname: string, href: string) {
    if (href === "/admin") {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNavigation() {
 const pathname = usePathname();

 return (
<>
<aside className="hidden w-64 shrink-0 border-r border-white/[0.07] lg:block">
<nav
aria-label="Admin navigation"
className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col px-4 py-7">
    {navigationGroups.map((group) => (
        <section key={group.label} className="mb-8">
            <h2 className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                {group.label}
            </h2>

            <ul className="space-y-1">
                {group.items.map((item) => {
                    const active = isActiveRoute(
                        pathname,
                        item.href
                    );

                    return (
                        <li key={item.href}>
                            <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={`
                                    group relative flex items-center gap-3
                                    rounded-lg px-3 py-2.5 text-sm
                                    transition-colors
                                ${
                                    active
                                    ? "bg-white/8 font-medium text-white"
                                    : "text-zinc-500 hover:bg-white/4 hover:text-zinc-200"
                                }
                            `}
                            >
                                
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </section>
    ))}
</nav>
</aside>
</>
 );
}
