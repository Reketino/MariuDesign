import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function PublicHeader() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="border-b border-zinc-800">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight text-white"
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

                    {user ? (
                        <Link
                        href="/account"
                        className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            Account
                        </Link>
                    ) : (
                        <Link
                        href="/login"
                        className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            Log in
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}