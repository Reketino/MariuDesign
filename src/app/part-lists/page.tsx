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
                            
                        })}
                    </section>
                )}
            </main>
        )
}