import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
    .from("products")
    .select(`
        id,
        title,
        slug,
        description,
        status,
        license,
        created_at,
        category_id,
        categories (
        id,
        name,
        slug
        )
        `)
        .order("created_at", {
            ascending: false,
        });
    
}