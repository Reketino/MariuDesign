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
}