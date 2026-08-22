import Link from "next/link";

import ProductForm from "@/components/admin/products/ProductForm";

import { createClient } from "@/lib/supabase/server";

type EditProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};