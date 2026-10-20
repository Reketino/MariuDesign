import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { error } from "console";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ id: string}>;
};

export async function GET(
    _request: Request,
    { params }: RouteContext
) {
    const { id } = await params;

    const { data: document, error: documentError } = await supabaseAdmin
    .from("product_documents")
    .select("id, document_type, source_type, storage_path, external_url, products!inner(id, status)")
    .eq("id", id)
    .maybeSingle();

    if (documentError) {
        console.error("Failed to fetch public document:", documentError);

        return NextResponse.json(
            { error: "Could not load document." },
            { status: 500 }
        );
    }

    if (!document) {
        return NextResponse.json(
            { error: "Document not found." },
            { status: 404 }
        );
    }

    const product = Array.isArray(document.products)
    ? document.products[0]
    : document.products;

    if (!product || product.status !== "published") {
        return NextResponse.json(
            { error: "Document not found." },
            { status: 404 }
        );
    }

    if (document.source_type === "google docs") {
        if (!document.external_url) {
            return NextResponse.json(
                { error: "Document URL is missing" },
                { status: 404 }
            );
        }
        return NextResponse.redirect(document.external_url);
    }

    if (document.source_type !== "pdf" || !document.storage_path) {
        return NextResponse.json(
            { error: "Document file is unavaliable" }, 
            {status: 404 }
        );
    }

    const { data: signedUrlData, error: signedUrlError } =
    await supabaseAdmin.storage
    .from("product-documents")
    .createSignedUrl(document.storage_path, 60);

    if (signedUrlError || !signedUrlData?.signedUrl) {
        console.error("Failed to create signed document URL:", signedUrlError);

        return NextResponse.json(
            { error: "Could not open document." },
            { status: 500 }
        );
    }

    return NextResponse.redirect(signedUrlData.signedUrl);
}