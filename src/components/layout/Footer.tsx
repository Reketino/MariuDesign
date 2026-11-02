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
                <div className="grid grid-cols-2 gap-8">
                    <section>
                        <Link
                            href="/"
                            className="text-lg font-semibold tracking-tight text-white"
                        >
                            MariuDesign
                        </Link>

                        <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
                            High-quality digital designs for your next
                            3D print.
                        </p>
                    </section>

                    <nav aria-label="Footer navigation">
                        <h2 className="text-sm font-semibold text-white">
                            Explore
                        </h2>


                        <ul className="mt-3 space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 transition hover:text-white">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-zinc-500">
                        @ {currentYear} MariuDesign. All rights reserved.
                    </p>

                    <div className="flex flex-col sm:items-end">
                        <span className="text-xs text-zinc-500">
                            Designed & developed by
                        </span>

                        <Link
                            href="https://github.com/Reketino"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Reketino on GitHub"
                            className="font-(family-name:--font-signature) text-5xl text-white transition hover:text-zinc-400"
                        >
                            Reketino
                        </Link>

                        <span className="text-[9px] tracking-[0.2em] text-zinc-600">
                            DEVELOPER & CREATOR
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}