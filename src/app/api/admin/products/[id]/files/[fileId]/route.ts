import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { deleteProductFile } from "@/components/admin/products/utils/productFileService";

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
    const { id: poductId, fileId } = await params;
    
}