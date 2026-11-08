"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

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
        const supabase = createClient();

        const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)

        if (deleteError) {
            throw deleteError;
        }
        }

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="
                text-sm font-medium text-red-400 
                transition hover:text-red-300 
                disabled:cursor-not-allowed disabled:opacity-50"
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

