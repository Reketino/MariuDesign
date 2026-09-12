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

const ALLOWED_EXTENSIONS = [".stl", ".3mf", ".obj"];

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
    throw new Error("Only STL, 3MF, and OBJ files are supported.");
  }
}

export async function UploadProductFile({
  supabase,
  productId,
  file,
  version,
}: UploadProductFileParams): Promise<void> {
  validateFile(file);

  const extensions = getFileExtension(file.name);

  const storagePath = `products/${productId}/${crypto.randomUUID()}${extensions}`;

  const { error: uploadError } = await supabase.storage
    .from("product_files")
    .upload(storagePath, file, {
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

  if (uploadError) {
    throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
  }

  const { error: databaseError } = await supabase
   .from("product_files")
        .insert({
            product_id: productId,
            file_type: "product",
            file_name: file.name,
            storage_path: storagePath,
            version: version.trim() || "1.0",
        });

        if (databaseError) {
          await supabase.storage
          .from("product-files")
          .remove([storagePath]);

        throw new Error(databaseError.message);
        }
}

export async function deleteProductFile({
  supabase,
  fileId,
  storagePath,
}: DeleteProductFileParams): Promise<void> {
  const { error: databaseError } = await supabase
  .from("product_files")
  .delete()
  .eq("id",fileId)

  if (databaseError) {
    throw new Error(databaseError.message);
  }
}