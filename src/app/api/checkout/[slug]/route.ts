import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { error } from "console";

type RouteContext = {
    params: Promise<{
        slug: string;
    }>;
};

export async function POST(
    _request: Request,
    { params }: RouteContext,
) {
    const { slug } = await params;

    const supabase = await createClient();

    const { data: {
        user,
    },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            {
                error: "You must be logged in to purchase a product.",
            },
            {
                status: 401,
            },
        );
    }

    
}