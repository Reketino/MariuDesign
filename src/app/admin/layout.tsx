import Link from "next/link";
import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/requireAdmin";

type AdminLayoutProps = {
    children: ReactNode;
};

export default async function AdminLayout({
    children,
}: AdminLayoutProps) {
    const { user } = await requireAdmin();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <header className="border-b border-zinc-800 bg-zinc-950">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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
                        className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
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
                                    className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
                                >
                                    Products
                                </Link>
                            </li>

                        <li>
                            <Link
                            href="/admin/categories"
                            className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
                            >
                              Categories  
                            </Link>
                        </li>

                         <li>
                            <Link
                            href="/admin/orders"
                            className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
                            >
                              Orders 
                            </Link>
                        </li>

                         <li>
                            <Link
                            href="/admin/settings"
                            className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
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