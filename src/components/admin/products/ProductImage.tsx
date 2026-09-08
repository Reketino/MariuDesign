"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { ProductImage } from "@/types/products";

type ExistingProductImage = ProductImage & {
    url: string;
};

type ProductImagesProps = {
    images: File[];
    existingImages: ExistingProductImage[];
    onImageChange: (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    onDeleteImage: (image: ExistingProductImage) => void;
    onSetMainImage: (image: ExistingProductImage) => void;
    onReorderImages: (
        images: ExistingProductImage[],
    ) => Promise<void>;
};

export default function ProductImages({
    images,
    existingImages,
    onImageChange,
    onDeleteImage,
    onSetMainImage,
    onReorderImages,
}: ProductImagesProps) {
    const [orderedImages, setOrderedImages] =
        useState<ExistingProductImage[]>(existingImages);

    const [draggedImageId, setDraggedImageId] = useState<string | null>(
        null,
    );

    const [dragOverImageId, setDragOverImageId] = useState<string | null>(
        null,
    );

    useEffect(() => {
        setOrderedImages(existingImages);
    }, [existingImages]);

    function handleDragStart(
        event: React.DragEvent<HTMLElement>,
        imageId: string,
    ) {
        setDraggedImageId(imageId);

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", imageId);
    }

    function handleDragOver(
        event: React.DragEvent<HTMLElement>,
        imageId: string,
    ) {
        event.preventDefault();

        if (!draggedImageId || draggedImageId === imageId) {
            return;
        }

        event.dataTransfer.dropEffect = "move";
        setDragOverImageId(imageId);
    }

    async function handleDrop(
        event: React.DragEvent<HTMLElement>,
        targetImageId: string,
    ) {
        event.preventDefault();

        const sourceImageId =
            event.dataTransfer.getData("text/plain") ||
            draggedImageId;

        setDragOverImageId(null);
        setDraggedImageId(null);

        if (
            !sourceImageId ||
            sourceImageId === targetImageId
        ) {
            return;
        }

        const sourceIndex = orderedImages.findIndex(
            (image) => image.id === sourceImageId,
        );

        const targetIndex = orderedImages.findIndex(
            (image) => image.id === targetImageId,
        );

        if (sourceIndex === -1 || targetIndex === -1) {
            return;
        }

        const previousImages = orderedImages;
        const nextImages = [...orderedImages];

        const [movedImage] = nextImages.splice(sourceIndex, 1);

        nextImages.splice(targetIndex, 0, movedImage);

        const normalizedImages = nextImages.map(
            (image, index) => ({
                ...image,
                sort_order: index,
            }),
        );

        setOrderedImages(normalizedImages);

        try {
            await onReorderImages(normalizedImages);
        } catch {
            setOrderedImages(previousImages);
        }
    }

    function handleDragEnd() {
        setDraggedImageId(null);
        setDragOverImageId(null);
    }

    return (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
            <header>
                <h2 className="text-lg font-semibold text-white">
                    Product images
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Upload the images for this 3D model.
                </p>
            </header>

            {orderedImages.length > 0 && (
                <div className="mt-6">
                    <p className="mb-3 text-sm font-medium text-zinc-300">
                        Current images
                    </p>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {orderedImages.map((image, index) => (
                            <article
                                key={image.id}
                                draggable
                                onDragStart={(event) =>
                                    handleDragStart(event, image.id)
                                }
                                onDragOver={(event) =>
                                    handleDragOver(event, image.id)
                                }
                                onDrop={(event) =>
                                    handleDrop(event, image.id)
                                }
                                onDragEnd={handleDragEnd}
                                className={[
                                    "overflow-hidden rounded-xl border bg-zinc-950 transition",
                                    draggedImageId === image.id
                                        ? "border-zinc-500 opacity-50"
                                        : "border-zinc-800",
                                    dragOverImageId === image.id
                                        ? "border-white"
                                        : "",
                                ].join(" ")}
                            >
                                <div className="relative aspect-square cursor-grab active:cursor-grabbing">
                                    <Image
                                        src={image.url}
                                        alt={
                                            image.alt_text ??
                                            "Product image"
                                        }
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-3 px-3 py-2">
                                    <div>
                                        <span className="text-xs text-zinc-400">
                                            {index === 0
                                                ? "Main image"
                                                : `Image ${index + 1}`}
                                        </span>

                                        <span className="ml-2 text-xs text-zinc-600">
                                            #{image.sort_order}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {index !== 0 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onSetMainImage(image)
                                                }
                                                className="text-xs font-medium text-zinc-400 transition hover:text-white"
                                            >
                                                Set as main
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDeleteImage(image)
                                            }
                                            className="text-xs font-medium text-red-400 transition hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <p className="mt-3 text-xs text-zinc-600">
                        Drag and drop images to change their order.
                    </p>
                </div>
            )}

            <div className="mt-6">
                <label
                    htmlFor="product-images"
                    className="block text-sm font-medium text-zinc-300"
                >
                    Add images
                </label>

                <input
                    id="product-images"
                    name="product-images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={onImageChange}
                    className="mt-2 block w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700"
                />

                <p className="mt-2 text-xs text-zinc-600">
                    JPG, PNG or WebP. Maximum 5 MB per image.
                </p>

                {images.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-zinc-300">
                            Selected images
                        </p>

                        <ul className="mt-2 space-y-2">
                            {images.map((image) => (
                                <li
                                    key={`${image.name}-${image.lastModified}`}
                                    className="text-sm text-zinc-400"
                                >
                                    {image.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}