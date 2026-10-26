import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { error } from "console";

export const dynamic = "force-dynamic";

async function isAdmin() {
    const supabase = await createClient();

    const {data: {user}, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return false;
    }

    const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("role")
    .eq("id", user.id)
    .single();

    return !profileError && profile?.role === "admin";
}

export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 },
        );
    }

      const { data, error } = await supabaseAdmin
    .from("homepage_featured_products")
    .select(`
      id,
      product_id,
      position,
      created_at,
      products (
        id,
        title,
        slug,
        status,
        product_images (
          id,
          image_url,
          position
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
    `)
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
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: { productId?: unknown };

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
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

  const nextPosition = (lastProduct?.position ?? -1) + 1

  const { data, error } = await supabaseAdmin
  .from("homepage_featured_products")
  .insert({ product_id: productId, position: nextPosition })
  .select("id, product_id, positions")
  .single();

  if (error) {
    console.error("Failed to add featured product:", error);

    return NextResponse.json(
      { error: "Could not add featured product" },
      { status: 500 },
    );
  }

  return NextResponse.json({ product: data}, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
}