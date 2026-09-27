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

        const { data: product, error: productError } = await supabase
        .from("products")
        .select(`
            id,
            title,
            slug,
            status,
            product_prices (
                id,
                currency,
                amount
            )
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

        const price = product.product_prices?.[0];

        if (!price) {
            return NextResponse.json(
                {
                    error: "This product does not have a price."
                },
                {
                    status: 400,
                },
            );
        }

        const amount = Number(price.amount)

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json(
                {
                    error: "Invalid product price.",
                },
                {
                    status: 400,
                },
            );
        }

        const currency = price.currency.toLowerCase();

        const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: user.id,
            status: "pending",
            currency: price.currency,
            total_amount: amount
        })
        .select("id")
        .single();

        if (orderError || !order) {
            console.error(
                "Failed to create order:",
                orderError,
            );
        }
}