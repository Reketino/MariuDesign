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

            </section>
)
}