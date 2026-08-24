import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function CategoriesPage() {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");
   
    if (error) {
        throw new Error("Failed to load categories")
    }

    return (
        <section className="space-y-8">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-500">
                        Store 🛒
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                        Categories 🗂️
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                        Manage the categories used to organize your 3D models.
                    </p>
                </div>

                <Link
                    href="/admin/categories/new"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                >
                    Add category
                </Link>
            </header>
        </section>
    )
}