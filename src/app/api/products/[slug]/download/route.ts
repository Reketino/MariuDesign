import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { error } from "console";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

const STORAGE_BUCKET = "product_files";

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "You must be logged in to download this product.",
      },
      {
        status: 401,
      },
    );
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      `
            id,
            title,
            slug,
            status
        `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (productError || !product) {
    return NextResponse.json(
      {
        error: "Product not found.",
      },
      {
        status: 404,
      },
    );
  }

  const { data: paidOrder, error: orderError } = await supabaseAdmin
    .from("orders")
    .select(
      `
        id,
        status,
        order_items!inner (
        product_id
        )
        `,
    )
    .eq("user_id", user.id)
    .eq("status", "paid")
    .eq("order_items.product_id", product.id)
    .limit(1)
    .maybeSingle();

  if (orderError) {
    console.error("Failed to verify product purchase:", orderError);

    return NextResponse.json(
      {
        error: "Failed to verify product purchase.",
      },
      {
        status: 500,
      },
    );
  }

  if (!paidOrder) {
    return NextResponse.json(
      {
        error: "You have not purchased this product.",
      },
      {
        status: 403,
      },
    );
  }

  const { data: productFile, error: fileError } = await supabase
    .from("product_files")
    .select(
      `
            id,
            file_name,
            storage_path,
            version
        `,
    )
    .eq("product_id", product.id)
    .eq("file_type", "product")
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (fileError) {
    console.error("Failed to fetch product file:", fileError);

    return NextResponse.json(
      {
        error: "Failed to find product file.",
      },
      {
        status: 500,
      },
    );
  }

  if (!productFile) {
    return NextResponse.json(
      {
        error: "No download file is available for this product.",
      },
      {
        status: 404,
      },
    );
  }

  const { data: signedUrl, error: signedUrlError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(productFile.storage_path, 60);

  if (signedUrlError || !signedUrl) {
    console.error("Failed to create signed download URL:", signedUrlError);

    return NextResponse.json(
      {
        error: "Failed to create download link.",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    url: signedUrl.signedUrl,
    fileName: productFile.file_name,
    version: productFile.version,
  });
}
