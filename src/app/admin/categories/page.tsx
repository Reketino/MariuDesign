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

            {categories && categories.length > 0 ? (
                <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-175 text-left">
                            <thead className="border-b border-zinc-800 bg-zinc-900">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Category 
                                    </th>

                                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Slug
                                    </th>

                                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-800">
                                {categories.map((category) => (
                                    <tr
                                    key={category.id}
                                    className="transition hover:bg-zinc-900"
                                    >
                                        <td className="px-6 py-5">
                                            <p className="font-medium text-white">
                                                {category.name}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="text-sm text-zinc-500">
                                                /{category.slug}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </section>
    )
}