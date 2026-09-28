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

            return NextResponse.json(
                {
                    error: "Failed to create order.",
                },
                {
                    status: 500,
                },
            );
        }

        const { error: orderItemError } = await supabase
        .from("order_items")
        .insert({
            order_id: order.id,
            product_id: product.id,
            price: amount,
            currency: price.currency,
        });

        if (orderItemError) {
            console.error(
                "Failed to create order item:",
                orderItemError,
            );

            await supabase 
            .from("orders")
            .delete()
            .eq("id", order.id);

            return NextResponse.json(
                {
                    error: "Failed to create order item.",
                },
                {
                    status: 500,
                },
            );
        }

        try {
            const siteUrl = 
            process.env.NEXT_PUBLIC_SITE_URL ??
            "http://localhost:3000";
        

        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: product.title,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            
            metadata: {
                order_id: order.id,
                product_id: product.id,
                user_id: user.id,
            },

            success_url: 
            `${siteUrl}/checkout/success` +
            `?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
            `${siteUrl}/products/${product.slug}`,
        });

        const { error: updateError } = await supabase
        .from("orders")
        .update({
            stripe_checkout_sessoin_id: session.id
        })
        .eq("id", order.id);

        if (updateError) {
            console.error(
                "failed to save Stripe checkout session:",
                updateError,
            );
            
        }
        }
}