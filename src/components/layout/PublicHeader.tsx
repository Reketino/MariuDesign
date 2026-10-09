import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/dist/server/api-utils";

export default async function PublicHeader() {
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
}