"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import ProductBasicInfo from "./ProductBasicInfo";
import ProductStoreSettings from "./ProductStoreSettings";
import ProductImages from "./ProductImage";

import type {
    ProductCategory,
    ProductFormData,
    ProductImage,
} from "@/types/products";

import { createSlug } from "./utils/createSlug";

import { createClient } from "@/lib/supabase/client";

type ProductFormProps = {
    categories: ProductCategory[];
    product?: ProductFormData;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
]

function getProductImage(
    images: ProductImage[] | null,
): ProductImage | null {
    if (!images) {
        return null;
    }
    return (
        images
            .filter((image) => image.sort_order >= 0)
            .sort((a, b) => a.sort_order - b.sort_order)[0] ?? null
    );
}

function getProductImageUrl(storagePath: string) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
}

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

    const existingImage = getProductImage(
        product?.product_images ?? null,
    );

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

        if (selectedFile.size > MAX_IMAGE_SIZE) {
            setError("Image is too large. Maximum file size is 5 MB.");

            event.target.value = "";
            setImage(null);
            return;
        }

        setImage(selectedFile);
    }

    async function uploadProductImage(productId: string) {
        if (!image) {
            return;
        }

        const fileExtension = image.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const fileName = `${crypto.randomUUID()}.${fileExtension}`;
        const storagePath = `${productId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(storagePath, image, {
                cacheControl: "3600",
                upsert: false,
                contentType: image.type
            });

        if (uploadError) {
            throw new Error(`Failed to upload product image: ${uploadError.message}`);
        }

        const { error: imageError } = await supabase
            .from("product_images")
            .insert({
                product_id: productId,
                storage_path: storagePath,
                alt_text: title,
                sort_order: 0,
            });

        if (imageError) {
            await supabase.storage
                .from("product-images")
                .remove([storagePath]);

            throw new Error(`Failed to save product image: ${imageError.message}`);
        }
    }

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const supabase = createClient();

        try {
            let productId = product?.id;

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
                    throw new Error(error.message);
                }
            } else {
                const { data, error } = await supabase
                    .from("products")
                    .insert({
                        title,
                        slug,
                        description: description || null,
                        category_id: categoryId || null,
                        status,
                        license: license || null,
                    })
                    .select("id")
                    .single();

                if (error) {
                    throw new Error(error.message);
                }

                productId = data.id;
            }

            if (productId && image) {
                await uploadProductImage(supabase, productId);
            }

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while saving the product."
            );

            setLoading(false);
        }
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
            <ProductBasicInfo
                title={title}
                slug={slug}
                description={description}
                onTitleChange={handleTitleChange}
                onSlugChange={setSlug}
                onDescriptionChange={setDescription}
            />

            <ProductStoreSettings
                categories={categories}
                categoryId={categoryId}
                status={status}
                license={license}
                onCategoryChange={setCategoryId}
                onStatusChange={setStatus}
                onLicenseChange={setLicense}
            />

            <ProductImages
                image={image}
                existingImage={
                    existingImage
                        ? {
                            ...existingImage,
                            url: getProductImageUrl(
                                existingImage.storage_path,
                            ),
                        }
                        : null
                }
                onImageChange={handleImageChange}
            />

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
                                : "Create product"}
                    </button>
                </div>
            </div>
        </form>
    );
}