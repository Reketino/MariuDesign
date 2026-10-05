import Link from "next/link";

import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type SuccessPageProps = {
    searchParams: Promise<{
        session_id?: string;
    }>;
};

export default async function CheckoutSuccessPage({
    searchParams,
}: SuccessPageProps) {
    const { session_id: sessionId } = await searchParams;

    if (!sessionId) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
                <section className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
                <h1 className="text-2xl font-semibold text-white">
                    Invalid checkout session
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                     We could not find a valid Stripe checkout session.
                </p>

                <Link
                href="/shop"
                className="mt-8 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                >
                    Back to store
                </Link>
                </section>
            </main>
        );
    }

    const supabase = await createClient();

    const { data: { user }} = await supabase.auth.getUser();

    if (!user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
                <section className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
                <h1 className="text-2xl font-semibold text-white">
                    You need to be logged in to access your purchase.
                </h1>

                <Link
                href="/login"
                className="mt-8 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                >
                    Log in
                </Link>
                </section>
            </main>
        );
    }

    let session;

    try {
        session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
        console.error("Failed to retrieve Stripe chekout session:", error);

        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
                <section className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
                <h1 className="text-2xl font-semibold text-white">
                    Checkout error
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                    We could not verify your Stripe chekout session.
                </p>

                <Link
                href="/shop"
                className="mt-8 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                >
                   Back to store 
                </Link>
                </section>
            </main>
        );
    }

    if (session.payment_status !== "paid") {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
                <section className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
                <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                    Mariudesign
                </p>

                <h1 className="mt-3 text-2xl font-semibold text-white">
                    Payment is still processing
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Stripe has not confirmed the payment yet. Please wait a
                    moment and check your order again.
                </p>

                <Link
                href="/shop"
                className="mt-8 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                >
                    Back to store
                </Link>
                </section>
            </main>
        );
    }

    const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select(
        `
        id,
        status,
        total_amount,
        currency,
        stripe_checkout_session_id
        `,
    )
    .eq("stripe_checkout_session_id", session.id)
    .eq("user_id", user.id)
    .maybeSingle();

    if (orderError) {
        console.error("Failed to fetch order:", orderError);

        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
                
            </main>
        )
    }
}