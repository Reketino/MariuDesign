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

function getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf(".");

    if (lastDot === -1) {
        return "";
    }

    return fileName.slice(lastDot).toLowerCase();
}

function validateFile(file: File): void {
    const extensions = getFileExtension(file.name);

    if (!ALLOWED_EXTENSIONS.includes(extensions)) {
        throw new Error(
            "Only STL, 3MF, and OBJ files are supported."
        );
    }
}

export async function UploadProductFile({
    supabase,
    productId,
    file,
    version,
}: UploadProductFileParams): Promise<void> {
    validateFile(file);
}