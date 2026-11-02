import Link from "next/link";

import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <header className="border-b border-zinc-800">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight text-white"
                    >
                        Mariudesign
                    </Link>

                    <Link
                        href="/shop"
                        className="text-sm text-zinc-400 transition hover:text-white"
                    >
                        Store
                    </Link>
                </div>
            </header>

            <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-2xl">
                        <div className="text-center">
                            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                                Mariudesign
                            </p>

                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                Create your account
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-zinc-400">
                                Create an account to purchase and access your
                                digital products.
                            </p>
                        </div>

                        <div className="mt-8">
                            <SignupForm />
                        </div>

                        <div className="mt-8 border-t border-zinc-800 pt-6 text-center">
                            <p className="text-sm text-zinc-500">
                                Already have an account?
                            </p>

                            <Link
                                href="/login"
                                className="mt-2 inline-block text-sm font-medium text-white transition hover:text-zinc-300"
                            >
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}