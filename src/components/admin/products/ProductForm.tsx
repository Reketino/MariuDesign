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

import {
    getProductImages,
    getProductImageUrl,
} from "./utils/productImage";

import { createSlug } from "./utils/createSlug";
import { validateProductImage } from "./utils/validateProductImage";
import {
    deleteProductImage,
    reorderProductImages,
    setProductImageAsMain,
    uploadProductImages,
} from "./utils/productImageService";
import {
    deleteProduct,
    saveProduct
} from "./utils/productService";
import { validateProduct } from "./utils/validateProduct";

import { createClient } from "@/lib/supabase/client";

type ProductFormProps = {
    categories: ProductCategory[];
    product?: ProductFormData;
};

export default function ProductForm({
    categories,
    product,
}: ProductFormProps) {
    const router = useRouter();
    const supabase = createClient();

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

    const [images, setImages] = useState<File[]>([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const existingImages = getProductImages(
        product?.product_images ?? null,
    );

    function handleTitleChange(value: string) {
        setTitle(value);
        setSlug(createSlug(value));
    }

    function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const selectedFiles = Array.from(event.target.files ?? []);

        setError("");

        if (selectedFiles.length === 0) {
            setImages([]);
            return;
        }

        for (const file of selectedFiles) {
            const validationError = validateProductImage(file);

            if (validationError) {
                setError(`${file.name}: ${validationError}`);
                event.target.value = "";
                setImages([]);
                return;
            }
        }

        setImages(selectedFiles);
    }

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();
        setError("");

        const validationError = validateProduct({
            title,
            slug,
            categoryId,
            status,
            license
        });

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const productId = await saveProduct({
                supabase,
                productId: product?.id,
                values: {
                    title,
                    slug,
                    description,
                    category_id: categoryId,
                    status,
                    license,
                },
            });

            if (images.length > 0) {
                await uploadProductImages({
                    supabase,
                    productId,
                    images,
                    title,
                    existingImages,
                });
            }

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while saving the product.",
            );

            setLoading(false);
        }
    }

    async function handleDeleteImage(image: ProductImage) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this image?",
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setLoading(true);

        try {
            await deleteProductImage({
                supabase,
                image,
            });

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while deleting the product image.",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleSetMainImage(image: ProductImage) {
        if (!product) {
            return;
        }

        setError("");
        setLoading(true);

        try {
            await setProductImageAsMain({
                supabase,
                productId: product.id,
                imageId: image.id,
            });

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while setting the main product image.",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleReorderImages(
        reorderedImages: ProductImage[],
    ) {
        if (!product) {
            return;
        }

        setError("");
        setLoading(true);

        try {
            await reorderProductImages({
                supabase,
                productId: product.id,
                imageIds: reorderedImages.map(
                    (image) => image.id,
                ),
            });

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while reordering the product images.",
            );

            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!product) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.title}"? Be aware this action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setDeleting(true);

        try {
            await deleteProduct({
                supabase,
                productId: product.id,
            });

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while deleting the product.",
            );

            setDeleting(false);
        }
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
                images={images}
                existingImages={existingImages.map((image) => ({
                    ...image,
                    url: getProductImageUrl(image.storage_path),
                }))}
                onImageChange={handleImageChange}
                onDeleteImage={handleDeleteImage}
                onSetMainImage={handleSetMainImage}
                onReorderImages={handleReorderImages}
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