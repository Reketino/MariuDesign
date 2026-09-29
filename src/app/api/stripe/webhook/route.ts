import { NextResponse } from "next/server";

import Stripe from "stripe";

import { stripe } from "@/lib/stripe/server";

import { createClient } from "@/lib/supabase/server";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}