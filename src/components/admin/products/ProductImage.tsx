"use client";

import Image from "next/image";

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
};

export default function ProductImages({
    images,
    existingImages,
    onImageChange,
}: ProductImagesProps) {
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

            {existingImages.length > 0 && (
                <div className="mt-6">
                    <p className="mb-3 text-sm font-medium text-zinc-300">
                        Current images
                    </p>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {existingImages.map((image, index) => (
                            <article
                                key={image.id}
                                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
                            >
                                <div className="relative aspect-square">
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

                                <div className="flex items-center justify-between px-3 py-2">
                                    <span className="text-xs text-zinc-400">
                                        {index === 0
                                            ? "Main image"
                                            : `Image ${index + 1}`}
                                    </span>

                                    <span className="text-xs text-zinc-600">
                                        #{image.sort_order}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
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