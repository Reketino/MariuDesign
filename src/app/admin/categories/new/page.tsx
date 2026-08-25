import Link from "next/link";

import CategoryForm from "@/components/admin/categories/CategoryForm";

export default function NewCategoryPage() {
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
                    Add category 🗂️
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                    Create a category for organizing your 3D models.
                </p>
            </header>

            <CategoryForm />
        </section>
    );
}