import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

const navigationLinks = [
    { label: "Store", href: "/shop" },
    { label: "Build Guides", href: "/build-guides" },
    { label: "Part Lists", href: "/part-lists" },
];

export default async function Navbar() {
    const supbase = await createClient();

    const { data: { user} } = await supbase.auth.getUser();

    const username =
    user?.user_metadata?.username
    user?.email?.split("@")[0] ??
    null;

     return (
        <header className="border-b border-zinc-800 bg-zinc-950">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight text-white"
                    aria-label="MariuDesign home"
                >
                    Mariudesign
                </Link>

                <nav
                    aria-label="Main navigation"
                    className="flex items-center gap-6"
                >
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            {link.label}
                        </Link>
                    ))}

                    {user ? (
                        <>
                            <Link
                                href="/account"
                                className="text-sm text-zinc-400 transition hover:text-white"
                            >
                                Account
                            </Link>

                            {username && (
                                <span className="text-sm font-medium text-white">
                                    {username}
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