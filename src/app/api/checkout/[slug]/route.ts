import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
    params: Promise<{
        slug: string;
    }>;
};

export async function POST(
    _request: Request,
    { params }: RouteContext,
) {

}