
import Link from "next/link";
import { getDashboardStats } from "@/lib/admin/getDashboardStats";

type StatCardProps = {
    label: string;
    value: number;
    description: string;
    icon: "products" | "categories" | "orders" | "guides" | "parts";
};

function StatIcon({ icon }: { icon: StatCardProps["icon"] }) {
    const paths = {
        products: (
            <>
                <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                <path d="m3 8 9 5 9-5" />
                <path d="M3 8v8l9 5 9-5V8" />
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
        guides: (
            <>
                <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z" />
                <path d="M4 4.5v17.5M8 7h8M8 11h7" />
            </>
        ),
        parts: (
            <>
                <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
                <path d="m4.5 7.7 7.5 4.5 7.5-4.5M12 12.2V21" />
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
            className="size-5"
        >
            {paths[icon]}
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-4"
        >
            <path d="M7 17 17 7M7 7h10v10" />
        </svg>
    );
}

function StatCard({
    label,
    value,
    description,
    icon,
}: StatCardProps) {
    return (
        <article className="group rounded-xl border border-white/[0.07] bg-[#111111] p-5 transition-colors hover:border-white/[0.14]">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">
                    {label}
                </p>

                <span className="flex size-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-zinc-400 transition-colors group-hover:text-white">
                    <StatIcon icon={icon} />
                </span>
            </div>

            <p className="mt-5 text-3xl font-semibold tracking-tight text-white tabular-nums">
                {String(value).padStart(2, "0")}
            </p>

            <p className="mt-1.5 text-xs text-zinc-500">
                {description}
            </p>
        </article>
    );
}

export default async function AdminPage() {
    const stats = await getDashboardStats();

    const overviewCards: StatCardProps[] = [
        {
            label: "Products",
            value: stats.products,
            description: `${stats.publishedProducts} published`,
            icon: "products",
        },
        {
            label: "Categories",
            value: stats.categories,
            description: "Product categories",
            icon: "categories",
        },
        {
            label: "Orders",
            value: stats.orders,
            description: `${stats.paidOrders} paid · ${stats.pendingOrders} pending`,
            icon: "orders",
        },
        {
            label: "Build guides",
            value: stats.buildGuides,
            description: "Available building guides",
            icon: "guides",
        },
        {
            label: "Part lists",
            value: stats.partLists,
            description: "Available parts lists",
            icon: "parts",
        },
    ];

    return (
        <main className="mx-auto w-full max-w-7xl space-y-10 pb-12">
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                        Store management
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Dashboard
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                        An overview of your store, products and documents.
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                    View store
                    <ArrowIcon />
                </Link>
            </header>

            <section aria-labelledby="overview-heading">
                <div className="mb-4 flex items-center justify-between">
                    <h2
                        id="overview-heading"
                        className="text-sm font-medium text-zinc-300"
                    >
                        Store overview
                    </h2>

                    <span className="text-xs text-zinc-600">
                        Current totals
                    </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {overviewCards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </div>
            </section>

            <section aria-labelledby="management-heading">
                <div className="mb-4">
                    <h2
                        id="management-heading"
                        className="text-sm font-medium text-zinc-300"
                    >
                        Management
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                        Quick access to your store resources.
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <article className="rounded-xl border border-white/[0.07] bg-[#111111] p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="flex size-10 items-center justify-center rounded-lg border border-white/[0.07] bg-white/3 text-zinc-300">
                                    <StatIcon icon="products" />
                                </span>

                                <h3 className="mt-5 text-lg font-semibold text-white">
                                    Products
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-zinc-500">
                                    Add, edit and manage your 3D models.
                                </p>
                            </div>

                            <span className="rounded-full border border-white/8 px-2.5 py-1 text-xs text-zinc-400">
                                {stats.products} total
                            </span>
                        </div>

                        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-5">
                            <p className="text-xs text-zinc-500">
                                {stats.products === 0
                                    ? "Your product catalog is empty."
                                    : `${stats.publishedProducts} of ${stats.products} products published`}
                            </p>

                            <Link
                                href={
                                    stats.products === 0
                                        ? "/admin/products/new"
                                        : "/admin/products"
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                            >
                                {stats.products === 0
                                    ? "Add product"
                                    : "Manage products"}
                                <ArrowIcon />
                            </Link>
                        </div>
                    </article>

                    <article className="rounded-xl border border-white/[0.07] bg-[#111111] p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="flex size-10 items-center justify-center rounded-lg border border-white/[0.07] bg-white/3 text-zinc-300">
                                    <StatIcon icon="guides" />
                                </span>

                                <h3 className="mt-5 text-lg font-semibold text-white">
                                    Build guides & part lists
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-zinc-500">
                                    Manage documentation connected to your products.
                                </p>
                            </div>

                            <span className="rounded-full border border-white/8 px-2.5 py-1 text-xs text-zinc-400">
                                {stats.buildGuides + stats.partLists} total
                            </span>
                        </div>

                        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-5">
                            <p className="text-xs text-zinc-500">
                                {stats.buildGuides} guides · {stats.partLists} part lists
                            </p>

                            <Link
                                href="/admin/documents"
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                            >
                                Manage documents
                                <ArrowIcon />
                            </Link>
                        </div>
                    </article>
                </div>
            </section>

            <section aria-labelledby="quick-links-heading">
                <div className="mb-4">
                    <h2
                        id="quick-links-heading"
                        className="text-sm font-medium text-zinc-300"
                    >
                        Quick access
                    </h2>
                </div>

                <nav className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {[
                        {
                            label: "Products",
                            description: "Manage your catalog",
                            href: "/admin/products",
                        },
                        {
                            label: "Categories",
                            description: "Organize your products",
                            href: "/admin/categories",
                        },
                        {
                            label: "Orders",
                            description: "Review customer orders",
                            href: "/admin/orders",
                        },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#111111] p-4 transition hover:border-white/16 hover:bg-[#161616]"
                        >
                            <div>
                                <p className="text-sm font-medium text-zinc-200 transition group-hover:text-white">
                                    {item.label}
                                </p>

                                <p className="mt-1 text-xs text-zinc-500">
                                    {item.description}
                                </p>
                            </div>

                            <span className="text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-white">
                                <ArrowIcon />
                            </span>
                        </Link>
                    ))}
                </nav>
            </section>
        </main>
    );
}
