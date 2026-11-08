"use server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";

type DeleteProductResult = {
    success: boolean;
    error?: string;
};