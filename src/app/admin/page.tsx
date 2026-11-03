import Link from "next/link";

import { getDashboardStats } from "@/lib/admin/getDashboardStats";
import { stat } from "fs";

export default async function AdminPage() {
    const stats = await getDashboardStats();

    const overviewCards = [
        {
            label: "Products",
            value: stats.products,
            description: `${stats.publishedProducts} published`,
        },
        {
            label: "Categories",
            value: stats.categories,
            description: "Product categories",
        },
            {
            label: "Orders",
            value: stats.orders,
            description: `${stats.paidOrders} paid - ${stats.pendingOrders} pending`,
        },
        {
            label: "Build Guides",
            value: stats.buildGuides,
            description: "Available building guides",
        },
        {
            label: "Part Lists",
            value: stats.partLists,
            description: "Available parts lists",
        },
    ];
   
    return (
        <section className="space-y-8">
            <header>
                <p className="text-sm font-medium text-zinc-500">
                    Overview
                </p>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                    Dashboard
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                    Manage your products, categories, orders and store
                    settings from one place.
                </p>
            </header>

            <section
                aria-label="Store overview"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
                {overviewCards.map((card) => (
                    <article
                    key={card.label}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5"
                    >
                        
                    </article>
                ))}
                <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-sm text-zinc-500">
                        Products
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-white">
                        0
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                        Products in your store
                    </p>
                </article>

                <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-sm text-zinc-500">
                        Categories
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-white">
                        0
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                        Product categories
                    </p>
                </article>

                <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-sm text-zinc-500">
                        Orders
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-white">
                        0
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                        Completed and pending orders
                    </p>
                </article>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
                <header>
                    <h2 className="text-lg font-semibold text-white">
                        Products
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        Add your first 3D model to the store.
                    </p>
                </header>

                <div className="mt-6 rounded-lg border border-dashed border-zinc-700 p-8 text-center">
                    <p className="text-sm text-zinc-400">
                        No products have been added yet.
                    </p>

                    <Link
                        href="/admin/products/new"
                        className="
                        mt-4 inline-flex rounded-lg bg-white px-4 py-2.5 
                        text-sm font-medium text-zinc-950 
                        transition hover:bg-zinc-200
                        "
                    >
                        Add your first product
                    </Link>
                </div>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
                <header>
                    <h2 className="text-lg font-semibold text-white">
                        Build Guides & Part List
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        Manage public building guides and parts lists for your products.
                    </p>
                </header>

                <div className="mt-6">
                    <Link
                        href="/admin/documents"
                        className="
                inline-flex items-center justify-center rounded-lg
                bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 
                transition hover:bg-zinc-200
                "
                    >
                        Manage documents
                    </Link>
                </div>
            </section>
        </section>
    );
}