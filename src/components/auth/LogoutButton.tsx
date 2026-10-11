"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogout() {
        setLoading(true);
        setError("");

        const supabase = createClient();

        const { error: signOutError } = await supabase.auth.signOut();

        if (signOutError) {
            console.error("Failed to log out:", signOutError);
            setError("Could not log out. Please try again");
            setLoading(false);
            return;
        }

        router.replace("/shop")
        router.refresh();
    }
    return (
        <div>
            <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? "Logging out..." : "Log out"}
            </button>

            {error && (
                <p role="alert" className="mt-3 text-sm text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}