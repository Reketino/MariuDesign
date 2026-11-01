import Link from "next/link";

const footerLinks = [
    { label: "Store", href: "/shop" },
    { label: "Build Guide", href: "/build-guides" },
    { label: "Part Lists", href: "/part-lists" },
    { label: "My account", href: "/account" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-zinc-800 bg-zinc-950">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-10 sm:grid-cols-2">
                    <section>
                        <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight text-white"
                        >
                            MariuDesign
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
                            High-quality digital designs for your next
                            3D print.
                        </p>
                    </section>
                </div>
            </div>
        </footer>
    )
}