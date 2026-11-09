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

        if (queryErrors.length > 0) {
            console.error("Failed to fetch product storage paths:", queryErrors);

            return {
                success: false,
                error: "Could not retrieve all product files.",
            };
        }

        const filesToDelete = [
            {
                bucket: STORAGE_BUCKET[0],
                paths: (imageResult.data ?? [])
                .map((item) => item.storage_path)
                .filter(Boolean),
            },
            {
                bucket: STORAGE_BUCKET[1],
                paths: (imageResult.data ?? [])
                .map((item) => item.storage_path)
                .filter(Boolean),
            },
            {
                bucket: STORAGE_BUCKET[2],
                paths: (imageResult.data ?? [])
                .map((item) => item.storage_path)
                .filter(Boolean),
            }, 
        ];

        const { data: deleteProduct, error: deleteError } =
        await supabaseAdmin
        .from("products")
        .delete()
        .eq("id", productId)
        .select("id")
        .maybeSingle();

        if (deleteError) {
            console.error("Failed to delete product:", deleteError);

            return {
                success: false,
                error:
                deleteError.code === "23503"
                ? "This product is connected to existing orders and cannot be deleted."
                : "Could not delete the product."
            };
        }

        if (!deleteProduct) {
            return {
                success: false,
                error: "Product not found.",
            };
        }
    }
}