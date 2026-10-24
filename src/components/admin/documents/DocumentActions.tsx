"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DocumentActionsProps = {
    documentId: string;
    documentTitle: string;
}

export default function DocumentActions({
    documentId,
    documentTitle,
}: DocumentActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${documentTitle}"?\n\nThis action 
            cannot be undone.`
        );

        if (!confirmed) return;
        setIsDeleting(true);
        setErrorMessage("");

        try {
            const response = await fetch(
                `/api/admin/documents/${documentId}`,
                {method: "Delete"}
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Failed to delete document.");
            }

            router.refresh();
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                ? error.message
                : "An unexpected error occurred."
            );
        } finally {
            setIsDeleting(false);
        }
    }
    return (
        <div className="flex flex-col items-start gap-2">
            <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="
            inline-flex items-center justify-center 
            rounded-lg border border-red-900/60 
            px-3 py-2 text-sm font-medium text-red-400 
            transition hover:bg-red-950/50 hover:text-red-300 
            disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </button>
        </div>
    )
}