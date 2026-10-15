import Link from "next/link";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
    await requireAdmin();

        const [{ data: products, error: productsError }, { data: documents, error: documentsError }] =
        await Promise.all([
            supabaseAdmin
                .from("products")
                .select("id, title, status")
                .order("title", { ascending: true }),

            supabaseAdmin
                .from("product_documents")
                .select(
                    "id, product_id, document_type, title, description, source_type, external_url, created_at"
                )
                .order("created_at", { ascending: false }),
        ]);

        if (productsError) {
            throw new Error("Failed to load products")
        }

        if (documentsError) {
            throw new Error("Failed to load product documents")
        }

        const productTitles = new Map(
            (products ?? []).map((product) => [product.id, product.title])
        );

        return (
            <section className="space-y-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500">
                            Store / Documents
                        </p>
                        
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                             Build Guides & Part Lists
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                        Manage building guides and parts lists associated with
                        your products. These documents will be publicly
                        accessible without requiring a purchase.
                        </p>
                    </div>

                    <Link
                    href="/admin"
                    className="
                    inline-flex items-center justify-center rounded-lg 
                    border border-zinc-700 px-4 py-2.5 
                    text-sm font-medium text-white transition hover:bg-zinc-800
                    "
                    >
                        Back to Dashboard
                    </Link>
                </header>
            </section>
        )
}