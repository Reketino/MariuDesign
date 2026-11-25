import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

const navigationLinks = [
    { label: "Store", href: "/shop" },
    { label: "Build Guides", href: "/build-guides" },
    { label: "Part Lists", href: "/part-lists" },
    { label: "Forum", href: "/forum " },
];

type UserRole = "user" | "admin"

type NavbarProps = {
    username: string | null;
    role: UserRole;
    isLoggedIn: boolean;
};

function NavigationLinks({
    username,
    role,
    isLoggedIn,
}: NavbarProps) {
    return (
        <>
            {navigationLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                    {link.label}
                </Link>
            ))}

            {isLoggedIn ? (
                <>
                    <Link
                        href="/account"
                        className="text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                        Account
                    </Link>

                    {username && (
                        <span className="group relative inline-flex items-center text-sm font-medium text-white">
                            <span>{username}</span>

                            {role === "admin" && (
                                <span className="                
                                        pointer-events-none absolute left-1/2 top-full z-50
                                        mt-2 -translate-x-1/2
                                        rounded-md border border-amber-500/30
                                      bg-zinc-950 px-2 py-1
                                        text-xs font-semibold text-amber-400
                                        opacity-0 transition-opacity duration-200
                                        group-hover:opacity-100
                                    "
                                >
                                    Admin
                                </span>
                            )}
                        </span>
                    )}
                </>
            ) : (
                <Link href="/login"
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                    Log in
                </Link>
            )}
        </>
    );
}

export default async function Navbar() {
    const supbase = await createClient();

    const { data: { user } } = await supbase.auth.getUser();

    let username: string | null = null;
    let role: UserRole = "user";

    if (user) {
        const { data: profile } = await supbase
            .from("profiles")
            .select("username, role")
            .eq("id", user.id)
            .single();

        username = profile?.username ??
            user.email?.split("@")[0] ??
            null;

        role = profile?.role === "admin" ? "admin" : "user";
    }

    const navigationProps: NavbarProps = {
        username,
        role,
        isLoggedIn: Boolean(user),
    };

    return (
        <header className="relative z-50 border-b border-zinc-800 bg-zinc-950">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                <Link
                    href="/"
                    aria-label="MariuDesign home"
                    className="shrink-0"
                >
                    <img
                        src="/logo/MARIUDESIGN-logo.svg"
                        alt="MariuDesign"
                        className="h-12 w-auto sm:h-14"
                    />
                </Link>

                <nav
                    aria-label="Main navigation"
                    className="hidden items-center gap-6 md:flex"
                >
                    <NavigationLinks {...navigationProps} />
                </nav>

                <details className="relative md:hidden">
                    <summary className="
                    flex cursor-pointer list-none items-center gap-2 
                    rounded-lg border border-zinc-700 px-3 py-2 
                    text-sm text-zinc-300 transition-colors 
                    hover:bg-zinc-900 
                    [&::-webkit-details-marker]:hidden
                    "
                    >
                        Menu
                        <span aria-hidden="true">☰</span>
                    </summary>

                    <nav
                        aria-label="Mobile navigation"
                        className="
                    absolute right-0 top-full mt-3 
                    flex min-w-52 flex-col gap-5 
                    rounded-xl border border-zinc-800 
                    bg-zinc-950 p-5 shadow-xl"
                    >
                        <NavigationLinks {...navigationProps} />
                    </nav>
                </details>
            </div>
        </header>
    );
}