"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import type { 
    ProductCategory,
    ProductFormData,
} from "@/types/products";

import { createClient } from "@/lib/supabase/client";

type ProductFormProps = {
    categories: ProductCategory[];
    product?: ProductFormData;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
]

export default function ProductForm({
    categories,
    product,
}: ProductFormProps) {
    const router = useRouter();

    const isEditing = Boolean(product);

    const [title, setTitle] = useState(product?.title ?? "");
    const [slug, setSlug] = useState(product?.slug ?? "");
    const [description, setDescription] = useState(
        product?.description ?? "",
    );
    const [categoryId, setCategoryId] = useState( 
        product?.category_id ?? "",
    );
    const [status, setStatus] = useState(
        product?.status ?? "draft",
    );
    const [license, setLicense] = useState(
        product?.license ?? "",
    );

    const [image, setImage] = useState<File | null>(null)

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    function createSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    function handleTitleChange(value: string) {
        setTitle(value);
        setSlug(createSlug(value));
    }

    function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const selectedFile = event.target.files?.[0] ?? null;

        setError("");

        if (!selectedFile) {
            setImage(null);
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
            setError("Invalid image type. Please use JPG, PNG OR WebP.");
            
            event.target.value = "";
            setImage(null);
            return;
        }
    }

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const supabase = createClient();

        if (isEditing && product) {
            const { error } = await supabase
            .from("products")
            .update({
                title,
                slug,
                description: description || null,
                category_id: categoryId || null,
                status,
                license: license || null,
            })
            .eq("id", product.id);

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
        } else {
            const { error } = await supabase
            .from("products")
            .insert({
                title,
                slug,
                description: description || null,
                category_id: categoryId || null,
                status,
                license: license || null,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
        }

        router.push("/admin/products");
        router.refresh();
    }

    async function handleDelete() {
        if (!product) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure Reite you want to delete this "${product.title}"? Be aware this action cannot be undone!.`,
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setDeleting(true);

        const supabase = createClient();

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", product.id);

        if (error) {
            setError(error.message);
            setDeleting(false);
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
                       {isEditing
                       ? "Edit product information"
                       : "Product information for MariuDesign"}
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
                            placeholder="Example: Sorting Bucket"
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
                            placeholder="sorting-bucket"
                            className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                        />

                        <p className="mt-2 text-xs text-zinc-600">
                            Used in the product URL.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-zinc-300"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            rows={6}
                            placeholder=" Here Reite, you should describe the model, compatible machinery, intended use, printing recommendations, and included parts."
                            className="mt-2 block w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
                <header>
                    <h2 className="text-lg font-semibold text-white">
                        Store settings ⚙️
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        Configure how the product appears in your store.
                    </p>
                </header>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-zinc-300"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={categoryId}
                            onChange={(event) =>
                                setCategoryId(event.target.value)
                            }
                            className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-500"
                        >
                            <option value="">
                                Uncategorized
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium text-zinc-300"
                        >
                            Status
                        </label>

                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                            className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-500"
                        >
                            <option value="draft">
                                Draft 📝
                            </option>

                            <option value="published">
                                Published 📰
                            </option>

                            <option value="archived">
                                Archived 📁
                            </option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="license"
                            className=""
                        >
                            License 📜
                        </label>

                        <select
                            id="license"
                            name="license"
                            value={license}
                            onChange={(event) =>
                                setLicense(event.target.value)
                            }
                            required
                            className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-500"
                        >
                            <option value="">
                                Select a license
                            </option>

                            <option value="personal">
                                Personal use
                            </option>

                            <option value="commercial">
                                Commercial use
                            </option>
                        </select>

                        <p className="mt-2 text-xs text-zinc-600">
                            Choose how customers are allowed to use your 3D model.
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

            <div className="flex items-center justify-between gap-3">
                {isEditing ? (
                    <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading || deleting}
                    className="rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete product"}
                    </button>
                ) : (     
                <div />
            )}

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white">
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
                    : "Creating product..." 
                    : isEditing
                    ? "Save changes"
                    :"Create product"}
                </button>
            </div>
            </div>
        </form>
    );
}