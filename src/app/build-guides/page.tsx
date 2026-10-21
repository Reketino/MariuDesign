import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force dynamic";

export default async function BuildGuidesPage() {
    const { data: documents, error} = await supabaseAdmin
        .from("product_documents")
        .select(`
            id,
            product_id,
            title,
            description,
            source_type,
            products!inner (
                title,
                slug,
                status
            )
        `)
        .eq("document_type", "build_guide")
        .eq("products.status", "published")
        .order("created_at", { ascending: false });

        if (error) {
            console.error("Failed to load build guides:", error);
            throw new Error("Failed to load build guides");
        }

        return (
            <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
                <header>
                    <p className="text-sm font-medium text-zinc-500">
                        Resources
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                        Build Guides
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                        Find assembly instructions and building guides for our
                        products. These documents are available without purchasing
                        the product.
                    </p>
                </header>

                {documents && documents.length > 0 ? (
                    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {documents.map((document) => {
                            const product = Array.isArray(document.products)
                            ? document.products[0]
                            : document.products;

                            if (!product) return null;

                            return(
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
                                </article>
                            )
                        })}
                    </section>
                )}
            </main>
        )
}