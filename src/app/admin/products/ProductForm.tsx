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
            
        </form>
    )
}