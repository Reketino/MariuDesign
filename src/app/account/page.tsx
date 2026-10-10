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
            console.error("Failed to fetch account orders:", error)
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
                    
                </section>
            </main>
        )

}