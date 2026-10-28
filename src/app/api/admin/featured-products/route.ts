import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { error } from "console";


export const dynamic = "force-dynamic";

async function isAdmin() {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("homepage_featured_products")
    .select(
      `
      id,
      product_id,
      position,
      created_at,
      products!inner (
        id,
        title,
        slug,
        status,
        product_images (
          id,
          product_id,
          storage_path,
          alt_text,
          sort_order
        ),
        product_prices (
          id,
          amount,
          currency
        ),
        categories (
          id,
          name,
          slug
        )
      )
    `,
    )
    .order("position", { ascending: true });

  if (error) {
    console.error("Failed to fetch featured products:", error);

    return NextResponse.json(
      { error: "Could not fetch featured products" },
      { status: 500 },
    );
  }

  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { productId?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const productId = body.productId;

  if (
    typeof productId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      productId,
    )
  ) {
    return NextResponse.json(
      { error: "A valid productId is required" },
      { status: 400 },
    );
  }

  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .select("id, status")
    .eq("id", productId)
    .maybeSingle();

  if (productError) {
    console.error("Failed to validate product:", productError);

    return NextResponse.json(
      { error: "Could not validate product" },
      { status: 500 },
    );
  }

  if (!product || product.status !== "published") {
    return NextResponse.json(
      { error: "Only published products can be featured" },
      { status: 400 },
    );
  }

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("homepage_featured_products")
    .select("id")
    .eq("product_id", productId)
    .maybeSingle();

  if (existingError) {
    console.error("Failed to check featured product:", existingError);

    return NextResponse.json(
      { error: "Could not check featured product" },
      { status: 500 },
    );
  }

  if (existing) {
    return NextResponse.json(
      { error: "Product is already featured" },
      { status: 409 },
    );
  }

  const { data: lastProduct, error: positionError } = await supabaseAdmin
    .from("homepage_featured_products")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (positionError) {
    console.error("Failed to determine position:", positionError);

    return NextResponse.json(
      { error: "Could not determine product position" },
      { status: 500 },
    );
  }

  const nextPosition = (lastProduct?.position ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("homepage_featured_products")
    .insert({
      product_id: productId,
      position: nextPosition,
    })
    .select("id, product_id, position")
    .single();

  if (error) {
    console.error("Failed to add featured product:", error);

    return NextResponse.json(
      { error: "Could not add featured product" },
      { status: 500 },
    );
  }

  return NextResponse.json({ product: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (
    !productId ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      productId,
    )
  ) {
    return NextResponse.json(
      { error: "A valid productId is required" },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin
    .from("homepage_featured_products")
    .delete()
    .eq("product_id", productId);

  if (error) {
    console.error("Failed to remove featured product:", error);

    return NextResponse.json(
      { error: "Could not remove featured product" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: { productsIds?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { productIds } = body;

  const isValidUuid = (value: unknown): value is string =>
    typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );

  if (
    !Array.isArray(productIds) ||
    !productIds.every(isValidUuid) ||
    new Set(productIds).size !== productIds.length
  ) {
    return NextResponse.json(
      { error: "A valid array of unique product IDs is required" },
      { status: 400 },
    );
  }

  const { data: featuredProducts, error: fetchError } = await supabaseAdmin
  .from("homepage_featured_products")
  .select("product_id");

  if (fetchError) {
    console.error("Failed to fetch featured products:", fetchError);

    return NextResponse.json(
      { error: "Could not fetch featured products" },
      { status: 500 },
    );
  }

  const currentIds = (featuredProducts ?? []).map(
    (product) => product.product_id,
  );

  if (
    productIds.length !== currentIds.length ||
    !currentIds.every((id) => productIds.includes(id))
  ) {
    return NextResponse.json(
      { error: "Product IDs must match the currently featured products" },
      { status: 400 },
    );
  }

  
}
