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

}