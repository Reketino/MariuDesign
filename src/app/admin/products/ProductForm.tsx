"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { ProductCategory } from "@/types/products";
import { createClient } from "@/lib/supabase/client";

type ProductFormProps = {
    categories: ProductCategory[];
}

export default function ProductForm({
    categories,
}: ProductFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [license, setLicense] = useState("");

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

    function handleTitleChange(value: string) {
        setTitle(value);
        setSlug(createSlug(value));
    }

    async function handleSubmit (
        event: React.SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault

        setError("");
        setLoading(true);

        const supabase = createClient();

        const { error } = await supabase 
        .from("products")
        .insert({
            title,
            slug,
            description: description || null,
            status,
            license: license || null,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/admin/products");
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
                    Product information
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Add the basic information for your 3D model here Reite.
                </p>
            </header>

            <div className="mt-6 space-y-6">
                <div>
                    <label
                    htmlFor="title"
                    className="block text-sm font-medium text-zinc-300"
                    >
                        Title
                    </label>

                    <input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(event) => 
                        handleTitleChange(event.target.value)
                    }
                    placeholder="Example: MTB stand"
                    required
                    className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                    />

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
                        placeholder="mountain-bike-stand"
                        className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                        />

                        <p className="mt-2 text-xs text-zinc-600">
                            Used in the prroduct URL.
                        </p>
                    </div>
                </div>
            </div>
            </section>
            
        </form>
    )
}