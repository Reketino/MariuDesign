"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";


type Category = {
    id: string;
    name: string;
    slug: string;
};

type CategoryFormProps = {
    category?: Category;
};

export default function CategoryForm({
    category
}: CategoryFormProps) {
    const router = useRouter();

    const isEditing = Boolean(category);

    const [name, setName] = useState(category?.name ?? "");
    const [slug, setSlug] = useState(category?.slug ?? "");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function createSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
    }

    function handleNameChange(value: string) {
        setName(value);

        if (!isEditing) {
            setSlug(createSlug(value));
        }
    }

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const supabase = createClient();

        if (isEditing && category) {
            const { error } = await supabase
                .from("categories")
                .update({
                    name,
                    slug,
                })
                .eq("id", category.id);

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

        } else {

            const { error } = await supabase
                .from("categories")
                .insert({
                    name,
                    slug,
                });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
        }
        router.push("/admin/categories");
        router.refresh();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
                <header>
                    <h2 className="text-lg font-semibold text-white">
                        {isEditing
                            ? "Edit category information"
                            : "Category information"}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        {isEditing
                            ? "Update the information for this category."
                            : "Add the basic information for your category."}
                    </p>
                </header>

                <div className="mt-6 space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-zinc-300"
                        >
                            Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            value={name}
                            onChange={(event) =>
                                handleNameChange(event.target.value)
                            }
                            placeholder="Example: Excavator Attachments"
                            required
                            className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="slug"
                            className="block text-sm font-medium text-zinc-300"
                        >
                            Slug
                        </label>

                        <input
                            id="slug"
                            name="slug"
                            type="text"
                            value={slug}
                            onChange={(event) =>
                                setSlug(event.target.value)
                            }
                            placeholder="execavator-attachments"
                            required
                            className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                        />

                        <p className="mt-2 text-xs text-zinc-600">
                            Used in the category URL.
                        </p>
                    </div>
                </div>
            </section>

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                    {error}
                </div>
            )}

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? isEditing
                            ? "Saving changes..."
                            : "Creating category..."
                        : isEditing
                            ? "Save changes"
                            : "Create category"}
                </button>
            </div>
        </form>
    );
}