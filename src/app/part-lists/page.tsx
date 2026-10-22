import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function PartListsPage() {
        const { data: documents, error } = await supabaseAdmin
        .from("product_documents")
        .select(`id, product_id, title, description, source_type, products!inner 
            (
                title,
                slug,
                status
            )
        `)
        .eq("document_type", "part_list")
        .eq("products.status", "published")
        .order("created_at", { ascending: false });

        if (error) {
            console.error("Failed to load part lists:", error);
            throw new Error("Failed to load part lists");
        }

        return (
            <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
                <header>
                    <p className="text-sm font-medium text-zinc-500">
                        Resources
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                        Part Lists
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                    Browse the parts and materials needed for our products.
                    These lists are available without purchasing the product.
                    </p>
                </header>

                {documents && documents.length > 0 ? (
                    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {documents.map((document) => {
                            const product = Array.isArray(document.products)
                            ? document.products[0]
                            : document.products;

                            if (!product) return null;
                            
                            return (
                                <article
                                key={document.id}
                                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5"
                                >
                                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        {product.title}
                                    </p>

                                    <h2 className="mt-2 text-lg font-semibold text-white">
                                        {document.title}
                                    </h2>

                                    {document.description && (
                                        <p className="mt-2 text-sm text-zinc-400">
                                            {document.description}
                                        </p>
                                    )}

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <Link 
                                        href={`/api/documents/${document.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                        inline-flex rounded-lg bg-white px-4 py-2 
                                        text-sm font-medium text-zinc-950 transition 
                                        hover:bg-zinc-200"
                                        >
                                            Open part list
                                        </Link>
                                    </div>
                                </article>
                            )
                        })}
                    </section>
                )}
            </main>
        )
}