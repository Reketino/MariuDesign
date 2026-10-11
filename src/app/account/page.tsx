import Link from "next/link";
import { redirect } from "next/navigation";

import DownloadProductButton from "@/components/admin/products/DownloadProductButton";
import LogoutButton from "@/components/auth/LogoutButton";
import PublicHeader from "@/components/layout/PublicHeader";

import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: orders, error } = await supabase
        .from("orders")
        .select(`
        id,
        status,
        total_amount,
        currency,
        created_at,
        order_items (
            product_id,
            products (
                title,
                slug
            )
        )
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to fetch account orders:", error);
    }

    const purchases = orders?.filter((order) => order.status === "paid") ?? [];

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <PublicHeader />

            <section className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
                <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                        Account
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                        Your account
                    </h1>

                    <p className="mt-3 text-zinc-400">
                        Manage your purchases and access your digital products.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_2fr]">
                    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                            Account details
                        </p>

                        <p className="mt-4 break-all text-sm text-white">
                            {user.email}
                        </p>

                        <div className="mt-6">
                            <LogoutButton />
                        </div>
                    </section>

                    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                                Purchases
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-white">
                                Your products
                            </h2>
                        </div>

                        <span className="text-sm text-zinc-500">
                            {purchases.length}{" "}
                            {purchases.length === 1
                            ? "purchase"
                            : "purchases"}
                        </span>
                    </div>
                    
                    {purchases.length === 0 ? (
                        <div className="mt-8 rounded-lg border border-dashed border-zinc-800 p-8 text-center">
                            <p className="text-sm text-zinc-500">
                                You have not purchased any products yet.
                            </p>

                            <Link 
                            href="/shop"
                            className="mt-4 inline-flex text-sm font-medium text-white transition hover:text-zinc-300"
                            >
                                Browse the store
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">
                           {purchases.map((order) => {
                            const item = order.order_items?.[0];

                            const product = Array.isArray(
                                item?.products,
                            )

                            ? item.products[0]
                            : item?.products

                            if (!product) {
                                return null;
                            }

                            return (
                                <article
                                key={order.id}
                                className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-5"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <Link
                                            href={`/products/${product.slug}`}
                                            className="font-medium text-white transition hover:text-zinc-300"
                                            >
                                                {product.title}
                                            </Link>

                                            <p className="mt-1 text-sm text-zinc-500">
                                                {Number(
                                                    order.total_amount,
                                                ).toFixed(2)}{" "}
                                                {order.currency}
                                            </p>

                                            
                                        </div>
                                    </div>
                                </article>
                            )
                           })} 
                        </div>
                    )}
                    </section>
                </div>
            </section>
        </main>
    )

}