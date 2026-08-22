import Link from "next/link";

import ProductForm from "@/components/admin/products/ProductForm";

import { createClient } from "@/lib/supabase/server";

type EditProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params

    const supabase = await createClient();
}