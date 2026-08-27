"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type DeleteCategoryButtonProps = {
    categoryId: string;
    categoryName: string;
};

export default function DeleteCategoryButton({
    categoryId,
    categoryName,
}: DeleteCategoryButtonProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${categoryName}"?`
        );

        if (!confirmed) {
            return;
        }
        
    }
}