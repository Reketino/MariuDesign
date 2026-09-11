import type { SupabaseClient } from "@supabase/supabase-js";

type UploadProductFileParams = {
    supabase: SupabaseClient;
    productId: string;
    file: File;
    version: string;
};

type DeleteProductFileParams = {
    supabase: SupabaseClient;
    fileId: string;
    storagePath: string;
};

const ALLOWED_EXTENSIONS = [
    ".stl",
    ".3mf",
    ".obj",
];