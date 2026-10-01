import { NextResponse } from "next/server";

import Stripe from "stripe";

import { stripe } from "@/lib/stripe/server";

import { createClient } from "@/lib/supabase/server";
import { error } from "console";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}

export async function POST(request: Request) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error(
            "Missing STRIPE_WEBHOOK_SECRET",
        );

        return NextResponse.json(
            {
                error: "Webhook configuration error.",
            },
            {
                status: 500,
            },
        );
    }
    const body = await request.text();

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            {
                error: "Missing Stripe signature."
            },
            {
                status: 400,
            },
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret,
        );
    } catch (error) {
        console.error(
            "Failed to verify Stripe webhook:",
            error,
        );

        return NextResponse.json(
            {
                error: "Invalid Stripe webhook signature.",
            },
            {
                status: 400,
            },
        );
    }

    const supabase = await createClient();

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;

                const orderId = 
                session.metadata?.order_id;

                if (!orderId) {
                    console.error(
                        "Stripe checkout session is missing order_id metadata."
                    );

                    return NextResponse.json(
                        {
                            error: "Missing order metadata.",
                        },
                        {
                            status: 400,
                        },
                    );
                }

                const { error } = await supabase
                .from("orders")
                .update({
                    status: "paid",
                })
                .eq("id", orderId)
                .eq("status", "pending");

                if (error) {
                    console.error(
                        "Failed to mark order as paid:",
                        error,
                    );

                    return NextResponse.json(
                        {
                            error: "Failed to update order.",
                        },
                        {
                            status: 500,
                        },
                    );
                }

                console.log(
                    `Order ${orderId} marked as paid.`,
                );

                break;
            }
            case "checkout.session.expired": {
                const session = event.data.object

                const orderId =
                session.metadata?.order_id;

                if (!orderId) {
                    console.warn(
                        "Expired Stripe session is missing order_id metadata."
                    );

                    break;
                }

                const { error } = await supabase
                .from("orders")
                .update({
                    status: "failed", 
                })
                .eq("id", orderId)
                .eq("status", "pending");

                if (error) {
                    console.error(
                        "Failed to mark expired order:",
                        error,
                    );
                    
                }
            }
        }
    }
}