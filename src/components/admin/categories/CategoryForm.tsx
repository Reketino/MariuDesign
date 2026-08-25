"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function CategoryForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
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
        setSlug(createSlug(value));
    }

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const supabase = createClient();

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
                    Category information
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Add the basic information for your category
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
                </div>
            </div>
            </section>
        </form>
    )
}