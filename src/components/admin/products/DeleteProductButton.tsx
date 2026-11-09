"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteProduct } from "@/lib/admin/deleteProducts";

type DeleteProductButtonProps = {
    productId: string;
    productTitle: string;
};

export default function DeleteProductButton({
    productId,
    productTitle,
}: DeleteProductButtonProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setLoading(true);

        try {
            const result = await deleteProduct(productId);

            if (!result.success) {
                setError(result.error ?? "Could not delete product.");
                return;
            }

            if (result.error) {
                console.error("Storage cleanup warning:", result.error);
            }

            
        } catch (error) {
            console.error("Failed to delete product:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while deleting the product.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="
                    rounded-md px-2 py-1.5 text-xs font-medium
                    text-zinc-500 transition-colors
                    hover:bg-red-500/10 hover:text-red-400
                    disabled:cursor-not-allowed disabled:opacity-50
                    "
            >
                {loading ? "Deleting..." : "Delete"}
            </button>

            {error && (
                <p
                    role="alert"
                    className="max-w-xs text-right text-xs text-red-400"

                >
                    {error}
                </p>
            )}
        </div>
    );
}

