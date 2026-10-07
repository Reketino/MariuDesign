import Link from "next/link";

import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

import DownloadProductButton from "@/components/admin/products/DownloadProductButton";

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
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <header className="border-b border-zinc-800">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                        <Link
                            href="/"
                            className="text-lg font-semibold tracking-tight"
                        >
                            Mariudesign
                        </Link>

                        <nav
                            aria-label="Main navigation"
                            className="flex items-center gap-6"
                        >
                            <Link
                                href="/shop"
                                className="text-sm text-zinc-400 transition hover:text-white"
                            >
                                Store
                            </Link>

                            <Link
                                href="/login"
                                className="text-sm text-zinc-400 transition hover:text-white"
                            >
                                Log in
                            </Link>
                        </nav>
                    </div>
                </header>

                <section className="mx-auto max-w-2xl px-6 py-24 text-center">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        Checkout
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                        Invalid checkout session
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-400">
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

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <section className="mx-auto max-w-2xl px-6 py-24 text-center">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        Checkout
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                        Log in to access your purchase
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-400">
                        You need to be logged in to access your purchased
                        products.
                    </p>

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
        console.error(
            "Failed to retrieve Stripe checkout session:",
            error,
        );

        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <section className="mx-auto max-w-2xl px-6 py-24 text-center">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        Checkout
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                        Checkout error
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-400">
                        We could not verify your Stripe checkout session.
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
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <section className="mx-auto max-w-2xl px-6 py-24 text-center">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        Payment processing
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                        Payment is still processing
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-400">
                        Stripe has not confirmed the payment yet. Please wait
                        a moment and try again.
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
            stripe_checkout_session_id,
            order_items (
                product_id,
                products (
                    title,
                    slug
                )
            )
        `,
        )
        .eq("stripe_checkout_session_id", session.id)
        .eq("user_id", user.id)
        .maybeSingle();

    if (orderError) {
        console.error("Failed to fetch order:", orderError);

        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <section className="mx-auto max-w-2xl px-6 py-24 text-center">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        Checkout
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                        Something went wrong
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-400">
                        We could not retrieve your order. Please try again.
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

    if (!order) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <section className="mx-auto max-w-2xl px-6 py-24 text-center">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        Payment received
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                        Thank you for your purchase.
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-400">
                        Your payment was successful, but we could not find
                        your order yet.
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

    const orderItem = order.order_items?.[0];

    const product = Array.isArray(orderItem?.products)
        ? orderItem.products[0]
        : orderItem?.products;

    if (!product) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <section className="mx-auto max-w-2xl px-6 py-24 text-center">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        Payment received
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                        Purchase complete
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-400">
                        Your payment was successful, but we could not find the
                        purchased product.
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

    if (order.status !== "paid") {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <section className="mx-auto max-w-2xl px-6 py-24 text-center">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        Payment received
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                        Payment received
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-zinc-400">
                        Your payment was successful. We are just waiting for
                        the order confirmation to finish processing.
                    </p>

                    <p className="mt-4 text-xs text-zinc-600">
                        Order: {order.id}
                    </p>

                    <Link
                        href={`/products/${product.slug}`}
                        className="mt-8 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                    >
                        View product
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <header className="border-b border-zinc-800">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight"
                    >
                        Mariudesign
                    </Link>

                    <nav
                        aria-label="Main navigation"
                        className="flex items-center gap-6"
                    >
                        <Link
                            href="/shop"
                            className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            Store
                        </Link>

                        <Link
                            href="/login"
                            className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            Log in
                        </Link>
                    </nav>
                </div>
            </header>

            <section className="mx-auto max-w-2xl px-6 py-24 text-center">
                <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                    Order complete
                </p>

                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                    Thank you for your purchase.
                </h1>

                <p className="mt-5 text-lg leading-8 text-zinc-400">
                    Your payment was successful. Your digital product is ready
                    to download.
                </p>

                <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-950/60 p-5 text-left">
                    <p className="text-xs uppercase tracking-widest text-zinc-500">
                        Product
                    </p>

                    <p className="mt-2 font-medium text-white">
                        {product.title}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4">
                        <span className="text-sm text-zinc-500">
                            Total
                        </span>

                        <span className="text-sm font-medium text-white">
                            {Number(order.total_amount).toFixed(2)}{" "}
                            {order.currency}
                        </span>
                    </div>
                </div>

                <div className="mt-8">
                    <DownloadProductButton slug={product.slug} />
                </div>

                <Link
                    href="/shop"
                    className="mt-4 inline-flex text-sm text-zinc-500 transition hover:text-white"
                >
                    Back to store
                </Link>

                <p className="mt-6 text-xs text-zinc-600">
                    Order: {order.id}
                </p>
            </section>
        </main>
    );
}