import Link from "next/link";
import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import AdminNavigation from "./_components/AdminNavigation";

type AdminLayoutProps = {
    children: ReactNode;
};

export default async function AdminLayout({
    children,
}: AdminLayoutProps) {
    const { user } = await requireAdmin();

    return (
        <div className="min-h-screen bg-[#090909] text-zinc-100">
            <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#090909]/95 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8">
                    <div className="flex items-center gap-10">
                    <Link
                        href="/admin"
                        className="text-lg font-semibold tracking-tight">
                        Mariudesign
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-zinc-400 sm:block">
                            {user.email}
                        </span>

                        <Link
                            href="/"
                            className="
                        rounded-lg border border-zinc-700 px-3 py-2 
                        text-sm text-zinc-300 hover:text-white
                        transition hover:border-zinc-500 
                        "
                        >
                            <span className="
                            flex size-8 items-center justify-center 
                            rounded-lg border border-white/10 
                            bg-white/5 text-sm font-semibold text-white"
                            >
                                M
                            </span>

                            <span className="text-sm font-semibold tracking-tight text-white">
                                MariuDesign
                            </span>

                            <span className="
                            hidden rounded-md border border-white/8 
                            px-2 py-1 text-[9px] font-medium uppercase 
                            tracking-wider text-zinc-500 sm:block
                            "
                            >
                             Admin   
                            </span>
                        </Link>
                    </div>


                    </div>
                </div>
            </header>

            {children}
        </div>
    );
}