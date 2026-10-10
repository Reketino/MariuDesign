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

}