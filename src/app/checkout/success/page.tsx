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
    const { session_id } = await searchParams;

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

                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/shop"
                        className="rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                    >
                        Back to store
                    </Link>

                    <Link
                        href="/"
                        className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                    >
                        Home
                    </Link>
                </div>
            </section>
        </main>
    );
}