"use server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";

type DeleteProductResult = {
    success: boolean;
    error?: string;
};

const STORAGE_BUCKET = [
    "product-images",
    "product_files",
    "product-documents",
] as const;