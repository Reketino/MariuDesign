import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <header className="border-b border-zinc-800">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight"
                    >
                        Mariudesign
                    </Link>

                    <nav aria-label="Main navigation">
                        <Link
                            href="/login"
                            className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            Log in
                        </Link>
                    </nav>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
                <div className="max-w-3xl">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        3D Printable Designs
                    </p>

                    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                        Digital designs for your next 3D print.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                        Explore and download high-quality 3D printable
                        models designed by Mariudesign.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <Link
                            href="/shop"
                            className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                        >
                            Browse designs
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}