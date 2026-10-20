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
}