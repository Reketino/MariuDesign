"use server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";

type DeleteProductResult = {
    success: boolean;
    error?: string;
};

const STORAGE_BUCKET = [
    "product-images",
    "product_files",
    "product-documents",
] as const;

export async function deleteProduct( 
    productId: string,
): Promise<DeleteProductResult> {
    try {
        await requireAdmin();

        if (!productId) {
            return {
                success: false,
                error: "Invalid product ID.",
            };
        }

        const [
            imageResult,
            filesResult,
            documentsResult,
        ] = await Promise.all([
            supabaseAdmin
            .from("product_images")
            .select("storage_path")
            .eq("product_id", productId),

            supabaseAdmin
            .from("product_images")
            .select("storage_path")
            .eq("product_id", productId),

            supabaseAdmin
            .from("product_images")
            .select("storage_path")
            .eq("product_id", productId),
        ]);

        const queryErrors = [
            imageResult.error,
            filesResult.error,
            documentsResult.error,
        ].filter(Boolean);

        if (queryErrors > 0) {
            
        }
    }
    
}