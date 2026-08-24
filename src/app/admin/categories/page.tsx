import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function CategoriesPage() {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");
    }
}