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
}