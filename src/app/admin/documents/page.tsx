import Link from "next/link";
import DocumentForm from "@/components/admin/documents/DocumentForm";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import DocumentActions from "@/components/admin/documents/DocumentActions";

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
                .select("id, product_id, document_type, title, description, source_type, external_url, created_at")
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

    const buildGuideCount = documents?.filter(
        (document) => document.document_type === "build_guide"
    ).length ?? 0;

    const partListCount = documents?.filter(
        (document) => document.document_type === "part_list"
    ).length ?? 0;

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

            <section className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-sm text-zinc-500">Products</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                        {products?.length ?? 0}
                    </p>
                </article>

                <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-sm text-zinc-500">Build Guides</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                        {buildGuideCount}
                    </p>
                </article>

                <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <p className="text-sm text-zinc-500">Part Lists</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                        {partListCount}
                    </p>
                </article>
            </section>

            <DocumentForm products={products ?? []} />

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
                <header>
                    <h2 className="text-lg font-semibold text-white">
                        Documents
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                        Documents currently associated with your products.
                    </p>
                </header>

                {documents && documents.length > 0 ? (
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-zinc-800 text-zinc-500">
                                <tr>
                                    <th className="px-3 py-3 font-medium">
                                        Title
                                    </th>
                                    <th className="px-3 py-3 font-medium">
                                        Product
                                    </th>
                                    <th className="px-3 py-3 font-medium">
                                        Type
                                    </th>
                                    <th className="px-3 py-3 font-medium">
                                        Source
                                    </th>

                                    <th className="px-3 py-3 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-800">
                                {documents.map((document) => (
                                    <tr key={document.id}>
                                        <td className="px-3 py-4 font-medium text-white">
                                            {document.title}
                                            {document.description && (
                                                <p className="mt-1 max-w-sm text-xs text-zinc-500">
                                                    {document.description}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-3 py-4 text-zinc-300">
                                            {productTitles.get(
                                                document.product_id
                                            ) ?? "Unknown product"}
                                        </td>

                                        <td className="px-3 py-4 text-zinc-300">
                                            {document.document_type ===
                                                "build_guide"
                                                ? "Build Guide"
                                                : "Part List"}
                                        </td>
                                        <td className="px-3 py-4 text-zinc-300">
                                            {document.source_type === "pdf"
                                                ? "PDF"
                                                : "Google Docs"}
                                        </td>

                                        <td className="px-3 py-4">
                                            <DocumentActions
                                            documentId={document.id}
                                            documentTitle={document.title}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="mt-6 rounded-lg border border-dashed border-zinc-700 p-8 text-center">
                        <h3 className="text-base font-medium text-white">
                            No documents yet
                        </h3>

                        <p className="mt-2 text-sm text-zinc-400">
                            Add a Build Guide or Part List to get started.
                        </p>
                    </div>
                )}
            </section>
        </section>
    );
}