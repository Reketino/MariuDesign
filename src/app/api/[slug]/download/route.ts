import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
    params: Promise<{
        slug: string;
    }>;
};

const STORAGE_BUCKET = "product_files";

export async function GET(
    _request: Request,
    { params }: RouteContext,
) {
    const { slug } = await params;

    const supabase = await createClient();

    const { data: product, error: productError } = await supabase
        .from("products")
        .select(`
            id,
            title,
            slug,
            status
        `)
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
}