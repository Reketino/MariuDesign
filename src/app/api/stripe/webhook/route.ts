import { NextResponse } from "next/server";

import Stripe from "stripe";

import { stripe } from "@/lib/stripe/server";

import { createClient } from "@/lib/supabase/server";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}

export async function POST(request: Request) {
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
    }
}