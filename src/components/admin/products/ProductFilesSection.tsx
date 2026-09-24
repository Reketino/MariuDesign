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
    }
    
}