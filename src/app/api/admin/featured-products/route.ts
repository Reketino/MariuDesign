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

  
}