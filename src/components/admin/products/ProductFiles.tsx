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
    )
}