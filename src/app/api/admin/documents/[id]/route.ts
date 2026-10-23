import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { error } from "console";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function DELETE(
    _request: Request,
    { params }: RouteContext
) {
    try {
        await requireAdmin();
    } catch {
        return NextResponse.json(
            { error: "Unathorized" },
            { status: 401 }
        );
    }
    
    const { id } = await params;

    const {data: document, error: fetchError} = await supabaseAdmin
    .from("product_documents")
    .select("id, source_type, storage_path")
    .eq("id", id)
    .maybeSingle();

    if (fetchError) { 
        console.error("Failed to fetch document:", fetchError) 

        return NextResponse.json(
            { error: "Could not load document." },
            { status: 500 }
        );
    }

    if (!document) {
        return NextResponse.json(
            { error: "Document not found." },
            { status: 400 }
        );
    }
    
}