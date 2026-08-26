import Link from "next/link";

import CategoryForm from "@/components/admin/categories/CategoryForm";

import { createClient } from "@/lib/supabase/server";

type EditCategoryPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditCategoryPage({
    params,
}: EditCategoryPageProps) {
    const { id } = await params;

    const supabase = await createClient();

    const { data: category, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("id", id)
        .single();

    if (error || !category) {
        throw new Error("Category not found");
    }

    return (
        <section className="space-y-8">
            <header>
                <Link
                    href="/admin/categories"
                    className="text-sm text-zinc-500 transition hover:text-white"
                >
                    ← Back to categories
                </Link>

                <p className="mt-6 text-sm font-medium text-zinc-500">
                    Store 🛒
                </p>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                    Edit category 🗂️
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                    Update the information for this category.
                </p>
            </header>

            <CategoryForm category={category} />
        </section>
    );
}