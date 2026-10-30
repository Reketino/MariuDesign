"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError("");
        setSuccess("");

        const normalizedUserName = username.trim().toLowerCase();
        const normalizedEmail = email.trim();

        if (!/^[a-z0-9_]{3,20}$/.test(normalizedUserName)) {
            setError("Username must be 3–20 characters and contain only letters, numbers, and underscores.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();

            const { data, error } = await supabase.auth.signUp({
                email: normalizedEmail,
                password,
                options: {
                    data: {
                        username: normalizedUserName,
                    },
                },
            });

            if (error) {
                setError(error.message);
                return;
            }

            if (data.session) {
                router.push("/shop");
                router.refresh();
                return;
            }

            setSuccess(
                "Account created. Please check your email to confirm your account."
            );
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignUp() {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/shop`,
                },
            });

            if (error) {
                setError("Unable to continue with Google. Please try again.");
            }
        } catch {
            setError("Something went wrong please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="
            flex w-full items-center justify-center gap-3
            rounded-lg border border-zinc-700 bg-zinc-950
            px-3 py-4 text-sm font-medium text-white
            transition hover:border-zinc-500 hover:bg-zinc-900
            disabled:cursor-not-allowed disabled:opacity-50
            "
            >
                {loading ? "Connecting to Google..." : "Continue with Google"}
            </button>

            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-800" />

                <span className="text-xs uppercase tracking-wider text-zinc-500">
                    Or register with email
                </span>

                <div className="h-px flex-1 bg-zinc-800" />
            </div>

            <div>
                <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                >
                    Username
                </label>

                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="username"
                    minLength={3}
                    maxLength={20}
                    pattern="[A-Za-z0-9_]{3,20}"
                    title="Use 3-20 letters, numbers, or underscores."
                    className="
                w-full rounded-lg border border-zinc-700 
                bg-zinc-950 px-4 py-3 text-sm text-white 
                outline-none transition placeholder:text-zinc-600 
                focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500
                "
                    required
                />

                <p className="mt-2 text-xs text-zinc-500">
                    3-20 characters. Letters, numbers, and underscores only.
                </p>
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                >
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="
                    w-full rounded-lg border border-zinc-700 bg-zinc-950 
                    px-4 py-3 text-sm text-white outline-none transition 
                    placeholder:text-zinc-600 focus:border-zinc-500 
                    focus:ring-1 focus:ring-zinc-500"
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                >
                    Password
                </label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="
                        w-full rounded-lg border border-zinc-700 
                        bg-zinc-950 px-4 py-3 text-sm text-white 
                        outline-none transition placeholder:text-zinc-600 
                        focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                >
                    Confirm password
                </label>

                <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(event.target.value)
                    }
                    placeholder="••••••••"
                    className="
                        w-full rounded-lg border border-zinc-700 bg-zinc-950 
                        px-4 py-3 text-sm text-white outline-none transition 
                        placeholder:text-zinc-600 focus:border-zinc-500 
                        focus:ring-1 focus:ring-zinc-500"
                    required
                />
            </div>


            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300"
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    role="status"
                    className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300"
                >
                    {success}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? "Creating account..." : "Create account"}
            </button>
        </form>
    )
}