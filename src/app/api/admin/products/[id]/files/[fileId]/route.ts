import { NextResponse } from "next/server";

import { deleteProductFile } from "@/components/admin/products/utils/productFileService";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";


type RouteContext = {
    params: Promise<{
        id: string;
        fileId: string;
    }>;
};

export async function DELETE(
    _request: Request,
    { params }: RouteContext,
) {
    const { id: productId, fileId } = await params;

    await requireAdmin();

    const supabase = await createClient();

    const { data: productFile, error: fileError } =
    await supabase
    .from("product_files")
    .select(
        `
        id,
        product_id,
        storage_path
        `,
    )
    .eq("id", fileId)
    .eq("product_id", productId)
    .single();

    if (fileError || !productFile) {
        return NextResponse.json(
            {
                error: "Product file not found.",
            },
            {
                status: 404,
            },
        );
    }

    try {
        await deleteProductFile({
            supabase,
            fileId: productFile.id,
            storagePath: productFile.storage_path,
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Failed to delete product:",
            error,
        );

        return NextResponse.json(
            {
                error:
                error instanceof Error
                ? error.message
                : "Failed to delete product file."
            },
            {
                status: 500,
            },
        );
    }
}