"use client";

import { useState } from "react";

import type { ProductFile } from "@/types/products";

type ProductFilesProps = {
    existingFiles: ProductFile[];
    selectedFiles: File[];
    version: string;
    onFilesChange: (files: File[]) => void;
    onVersionChange: (version: string) => void;
    onDeleteExistingFile: (file: ProductFile) => Promise<void>;
};

export default function ProductFiles({
    existingFiles,
    selectedFiles,
    version,
    onFilesChange,
    onVersionChange,
    onDeleteExistingFile,
}: ProductFilesProps) {
     const [deletingFileId, setDeletingFileId] = useState<string | null>(
        null,
    );

    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) {
            return;
        }

        onFilesChange([...selectedFiles, ...files]);

        event.target.value = "";
    }

    function removeSelectedFile(index: number) {
        onFilesChange(
            selectedFiles.filter((_, fileIndex) => fileIndex !== index),
        );
    }

      async function handleDeleteExistingFile(file: ProductFile) {
        setDeletingFileId(file.id);

        try {
            await onDeleteExistingFile(file);
        } finally {
            setDeletingFileId(null);
        }
    }


   return (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <header>
                <h2 className="text-base font-medium text-white">
                    Product files
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Upload the 3D model files customers will receive.
                </p>
            </header>

              <div className="mt-6">
                <label
                    htmlFor="product-version"
                    className="block text-sm font-medium text-zinc-300"
                >
                    Version
                </label>

                <input
                    id="product-version"
                    type="text"
                    value={version}
                    onChange={(event) =>
                        onVersionChange(event.target.value)
                    }
                    placeholder="1.0"
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
                />
            </div>
            </section>
)
}