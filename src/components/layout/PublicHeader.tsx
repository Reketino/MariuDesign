import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function PublicHeader() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    let username: string | null = null;
    let role: string | null = null;

    if (user) {
        const { data: profile, error } = await supabase
            .from("profiles")
            .select("username, role")
            .eq("id", user.id)
            .maybeSingle();

        if (error) {
            console.error("Failed to fetch header profile:", error);
        }

        username = profile?.username ?? null;
        role = profile?.role ?? null;
    }

    const linkClass = "whitespace-nowrap text-sm text-zinc-400 transition hover:text-white"

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
                    className="flex flex-wrap items-center justify-end gap-x-5 gap-y-3"
                >
                    <Link href="/shop" className={linkClass}>
                        Store
                    </Link>

                    <Link href="/build-guides"className={linkClass}>
                        Build Guides
                    </Link> 

                    <Link href="/part-lists" className={linkClass}>
                    Part Lists
                    </Link>
        

                    {user ? (
                        <>
                            <Link
                                href="/account"
                                className="text-sm text-zinc-400 transition hover:text-white"
                            >
                                Account
                            </Link>

                            {username && (
                                <span className="hidden text-sm font-medium text-white sm:inline">
                                    {username}
                                </span>
                            )}

                            {role === "admin" && (
                                <span className="
                            rounded-full border border-sky-500/30
                            bg-sky-500/10 px-2 py-0.5
                            text-xs font-medium text-sky-300
                            "
                                >
                                    Admin
                                </span>
                            )}
                        </>
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
    );
}