import Link from "next/link";
import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import AdminNavigation from "./_components/AdminNavigation";

type AdminLayoutProps = {
    children: ReactNode;
};

export default async function AdminLayout({
    children,
}: AdminLayoutProps) {
    const { user } = await requireAdmin();

    return (
        <div className="min-h-screen bg-[#090909] text-zinc-100">
            <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#090909]/95 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8">
                    <Link
                        href="/admin"
                        className="text-lg font-semibold tracking-tight">
                        Mariudesign
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-zinc-400 sm:block">
                            {user.email}
                        </span>

                        <Link
                            href="/"
                            className="
                        rounded-lg border border-zinc-700 px-3 py-2 
                        text-sm text-zinc-300 hover:text-white
                        transition hover:border-zinc-500 
                        "
                        >
                            View Store
                        </Link>
                    </div>
                </div>
            </header>

            <section className="mx-auto flex max-w-7xl">
                <aside className="hidden min-h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-zinc-800 py-6 md:block">
                    <nav aria-label="Admin navigation">
                        <ul className="space-y-1 px-3">
                            <li>
                                <Link
                                    href="/admin"
                                    className="block rounded-lg bg-zinc-800 px-3 py-2.5 text-sm font-medium text-white"
                                >
                                    Dashboard
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/admin/products"
                                    className="
                                    block rounded-lg px-3 py-2.5 
                                    text-sm text-zinc-400 hover:text-white
                                    transition hover:bg-zinc-900 
                                    "
                                >
                                    Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/admin/featured-products"
                                    className="
                                    block rounded-lg px-3 py-2.5
                                    text-sm text-zinc-400 hover:text-white
                                    transition hover:bg-zinc-900
                                    "
                                >
                                    Featured Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/admin/categories"
                                    className="
                            block rounded-lg px-3 py-2.5 
                            text-sm text-zinc-400 hover:text-white
                            transition hover:bg-zinc-900 
                            "
                                >
                                    Categories
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/admin/orders"
                                    className="
                            block rounded-lg px-3 py-2.5 
                            text-sm text-zinc-400 hover:text-white
                            transition hover:bg-zinc-900 
                            "
                                >
                                    Orders
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/admin/settings"
                                    className="
                            block rounded-lg px-3 py-2.5 
                            text-sm text-zinc-400 hover:text-white
                            transition hover:bg-zinc-900 
                            "
                                >
                                    Settings
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <main className="min-w-0 flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </section>
        </div>
    )
}