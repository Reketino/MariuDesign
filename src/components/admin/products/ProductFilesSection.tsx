"use client";

import { useState } from "react";

import type { ProductFile } from "@/types/products";

type ProductFileSectionProps = {
    productId: string;
    files: ProductFile[];
}

export default function ProductFileSection({
    productId,
    files,
}: ProductFileSectionProps) {
    const [ProductFiles, setProductFiles] =
    useState<ProductFile[]>(files);

    const [isDeleting, setIsDeleting] = useState<string | null>(
        null,
    );

    async function handleDelete(file: ProductFile) {
        const confirmed = window.confirm(
            `Delete "${file.file_name}"?`,
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(file.id);
        
    }

    try {
        const response = await fetch(
            `/api/admin/products/${productId}/files/${file.id}`,
            {
                method: "Delete",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Failed to delete file."
            );
        }

        setProductFiles((currentFiles) => 
        currentFiles.filter(
            (currentFile) =>
                currentFile.id !== file.id
        ),
        );
    } catch (error) {
        console.error(
            "Failed to delete product file:",
            error,
        );

        window.alert(
            error instanceof Error
            ? error.message
            : "Failed to delete file."
        );
    } finally {
        setIsDeleting(null);
    }
}

return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40">
        <div className="border-b border-zinc-800 px-6 py-5">
            <h2 className="text-base font-medium text-white">
                Product files
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
                Manage the downloadable files for 
                this product.
            </p>
        </div>

        {ProductFiles.length === 0 ? (
            <div className="px-6 py-10 text-center">
                <p className="text-sm text-zinc-500">
                    No product files uploaded yet.
                </p>
            </div>
        ) : (
            <ul className="divide-y divide-zinc-800">
                {ProductFiles.map((file) => (
                    <li
                    key={file.id}
                    className="flex items-center justify-between gap-6 px-6 py-5"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                                {file.file_name}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                                <span>
                                    Version {file.Version}
                                </span>

                                <span aria-hidden="true">
                                    •
                                </span>

                                <span>
                                    {file.file_type}
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>  
        )
        }

    </section>
)
