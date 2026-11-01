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
                        className=""
                        >

                        </Link>
                    </section>
                </div>
            </div>
        </footer>
    )
}