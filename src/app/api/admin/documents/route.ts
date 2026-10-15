import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { error } from "console";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const allowedDocumentTypes = ["build_guide", "part_list"] as const;

type DocumentType = (typeof allowedDocumentTypes)[number];

function isDocumentType(value: string): value is DocumentType {
  return allowedDocumentTypes.includes(value as DocumentType);
}

function isValidGoogleDocsUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "docs.google.com" &&
      url.pathname.startsWith("/document")
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();

    const productId = String(formData.get("productId") ?? "").trim();
    const DocumentType = String(formData.get("documentType") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const description =
      String(formData.get("description") ?? "").trim() || null;
    const sourceType = String(formData.get("sourceType") ?? "").trim();

    if (!productId || !title || !isDocumentType(DocumentType)) {
      return NextResponse.json(
        { error: "Product, title and document type are required." },
        { status: 400 },
      );
    }

    if (title.length > 150) {
      return NextResponse.json(
        { error: "Title must be 150 characters or fewer." },
        { status: 400 },
      );
    }

    if (description && description.length > 200) {
      return NextResponse.json(
        { error: "Description must be 2000 characters or fewer." },
        { status: 400 },
      );
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      console.error("Product lookup failed:", productError);
      return NextResponse.json(
        { error: "Could not verify the selected product." },
        { status: 500 },
      );
    }

    if (!product) {
      return NextResponse.json(
        { error: "The selected product does not exist." },
        { status: 404 },
      );
    }

    let storagePath: string | null = null;
    let externalUrl: string | null = null;

    if (sourceType === "pdf") {
      const file = formData.get("file");

      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json(
          { error: "Select a PDF file." },
          { status: 400 },
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "The PDF must be 20 MB or smaller." },
          { status: 400 },
        );
      }

      if (
        file.type !== "application/pdf" ||
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        return NextResponse.json(
          { error: "Only PDF files are supported." },
          { status: 400 },
        );
      }

      const safeFileName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .slice(-150);

      storagePath = `${productId}/${crypto.randomUUID()}-${safeFileName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("product-documents")
        .upload(storagePath, file, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (uploadError) {
        console.error("Document upload failed:", uploadError);

        return NextResponse.json(
          { error: "Could not upload the PDF." },
          { status: 500 },
        );
      }
    } else if (sourceType === "google_docs") {
      const submittedUrl = String(formData.get("externalUrl") ?? "").trim();

      if (!isValidGoogleDocsUrl(submittedUrl)) {
        return NextResponse.json(
          { error: "Enter a valid Google Docs document URL." },
          { status: 400 },
        );
      }

      externalUrl = submittedUrl;
    } else {
      return NextResponse.json(
        { error: "Select PDF or Google Docs" },
        { status: 400 },
      );
    }

    const { data: document, error: insertError } = await supabaseAdmin
      .from("product_documents")
      .insert({
        product_id: productId,
        document_type: DocumentType,
        title,
        description,
        source_type: sourceType,
        storage_path: storagePath,
        external_url: externalUrl,
      })
      .select(
        "id, product_id, document_type, title, description, source_type, external_url, created_at",
      )
      .single();

    if (insertError) {
      console.error("Document database insert failed:", insertError);

      if (storagePath) {
        await supabaseAdmin.storage
          .from("product_documents")
          .remove([storagePath]);
      }

      return NextResponse.json(
        { error: "Could not save the document." },
        { status: 500 },
      );
    }

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "NEXT_REDIRECT" ||
        error.message.includes("NEXT_REDIRECT"))
    ) {
      throw error;
    }

    console.error("Create document failed:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
