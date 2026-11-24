import Link from "next/link";

import FeaturedProducts from "@/components/home/FeaturedProducts";
import { getFeaturedProducts } from "@/lib/products/getFeaturedProducts";

export default async function HomePage() {
    const products = await getFeaturedProducts();

    return (
        <main className="bg-zinc-950 text-zinc-100">
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

            <FeaturedProducts products={products} />

            <section className="border-y border-zinc-800 bg-zinc-900/30">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 md:flex-row md:items-center md:justify-between lg:py-24">
                <div className="max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                        MariuDesign Forum
                    </p>

                    <p className="mt-3 max-w-xl leading-7 text-zinc-400">
                            Have questions about a design, need help with
                            your 3D printer or want to share your latest
                            creation? Join the discussion.
                    </p>
                </div>

                <div className="shrink-0">
                    <Link
                    href="/forum"
                    className="
                    inline-flex items-center gap-2 rounded-lg 
                    border border-zinc-700 bg-white px-5 
                    py-3 text-sm font-medium text-zinc-950 
                    transition hover:bg-zinc-200
                    "
                    >
                        Explore the Forum
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
            </section>
        </main>
    );
}
