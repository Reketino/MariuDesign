"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/account");
        router.refresh();
    }

    async function handleGoogleSignIn() {
        setError("");
        setGoogleLoading(true);

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/account`,
                },
            });

            if (error) {
                setError("Unable to sign in with Google. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setGoogleLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-white">
            <section className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="text-2xl font-semibold tracking-tight"
                    >
                        Mariudesign
                    </Link>

                    <p className="mt-3 text-sm text-zinc-400">
                        Welcome back. Sign in to your account.
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl sm:p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Sign in
                        </h1>

                        <p className="mt-2 text-sm text-zinc-400">
                            Access your account and manage your designs.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading || loading}
                        className="
                        flex w-full items-center justify-center 
                        gap-3 rounded-xl border border-zinc-700 
                        bg-zinc-950 px-4 py-3 text-sm font-medium transition 
                        hover:border-zinc-500 hover:bg-zinc-800 
                        disabled:cursor-not-allowed disabled:opacity-60
                        "
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 48 48"
                            className="h-5 w-5"
                        >
                            <path
                                fill="#EA4335"
                                d="
                                M24 9.5c3.54 0 6.71 1.22 9.21 
                                3.6l6.85-6.85C35.9 2.38 30.47 0 24 
                                0 14.62 0 6.51 5.38 3.01 13.22l7.98 
                                6.19C12.87 13.72 18.01 9.5 24 9.5Z
                                "
                            />
                            <path
                                fill="#4285F4"
                                d="
                                M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 
                                2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.99 
                                46.98 31.8 46.98 24.55Z
                                "
                            />
                            <path
                                fill="#FBBC05"
                                d="
                                M10.99 28.59A14.4 14.4 0 0 1 10.22 
                                24c0-1.59.27-3.13.77-4.59l-7.98-6.19A23.9 
                                23.9 0 0 0 0 24c0 3.87.93 7.52 3.01 
                                10.78l7.98-6.19Z
                                "
                            />
                            <path
                                fill="#34A853"
                                d="
                                M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 
                                1.45-4.89 2.3-8.18 2.3-5.99 0-11.13-4.22-13.01-9.91l-7.98 
                                6.19C6.51 42.62 14.62 48 24 48Z
                                "
                            />
                        </svg>

                        {googleLoading
                            ? "Connecting to Google..."
                            : "Continue with Google"}
                    </button>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-zinc-800" />

                        <span className="text-xs uppercase tracking-wider text-zinc-500">
                            Or continue with email
                        </span>

                        <div className="h-px flex-1 bg-zinc-800" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-zinc-200"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                className="
                                w-full rounded-xl border border-zinc-700 
                                bg-zinc-950 px-4 py-3 text-sm text-white 
                                outline-none transition placeholder:text-zinc-600 
                                focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700
                                "
                            />
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-zinc-200"
                                >
                                    Password
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-zinc-400 transition hover:text-white"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                className="
                                w-full rounded-xl border border-zinc-700 
                                bg-zinc-950 px-4 py-3 text-sm text-white 
                                outline-none transition placeholder:text-zinc-600 
                                focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700
                                "
                            />
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="
                                rounded-xl border border-red-900/70 
                                bg-red-950/40 px-4 py-3 
                                text-sm text-red-300
                                "
                            >
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="
                            w-full rounded-xl bg-white px-4 py-3 
                            text-sm font-semibold text-zinc-950 
                            transition hover:bg-zinc-200 
                            disabled:cursor-not-allowed disabled:opacity-60
                            "
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-medium text-white underline-offset-4 hover:underline"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-zinc-500">
                    By continuing, you agree to Mariudesign&apos;s terms and privacy policy.
                </p>
            </section>
        </main>
    );
}