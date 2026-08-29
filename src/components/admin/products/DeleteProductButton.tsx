"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type DeleteProductButtonProps = {
    productId: string;
    productTitle: string;
};

export default function DeleteCategoryButton({
    productId,
    productTitle,
}: DeleteProductButtonProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want delete "${productTitle}"?`,
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setLoading(true);

        const supabase = createClient();

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", productId)

        if (error) {
            setError(error.message)
            setLoading(false);
            return;
        }

        setLoading(false);
        router.refresh();
    }
}

