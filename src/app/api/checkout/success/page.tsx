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
                </section>
            </main>
        )
    }
}