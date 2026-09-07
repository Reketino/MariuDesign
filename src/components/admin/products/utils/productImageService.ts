import type { ProductImage } from "@/types/products";

type UploadProductImagesParams = {
  supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>;
  productId: string;
  images: File[];
  title: string;
  existingImages: ProductImage[];
};

export async function uploadProductImages({
  supabase,
  productId,
  images,
  title,
  existingImages,
}: UploadProductImagesParams): Promise<void> {
  if (images.length === 0) {
    return;
  }

  const nextSortOrder = existingImages.length;

  for (const [index, image] of images.entries()) {
    const storagePath = await uploadImageToStorage({
      supabase,
      productId,
      image,
    });

    try {
      await createProductImage({
        supabase,
        productId,
        storagePath,
        title,
        sortOrder: nextSortOrder + index,
      });
    } catch (error) {
      await removeStorageFile(supabase, storagePath);
      throw error;
    }
  }
}

type DeleteProductImageParams = {
    supabase: ReturnType<
        typeof import("@/lib/supabase/client").createClient
    >;
    image: ProductImage;
};

type UploadImageToStorageParams = {
  supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>;
  productId: string;
  image: File;
};

async function uploadImageToStorage({
  supabase,
  productId,
  image,
}: UploadImageToStorageParams): Promise<string> {
  const fileExtension = image.name.split(".").pop()?.toLowerCase() ?? "jpg";

  const storagePath = `${productId}/${crypto.randomUUID()}.${fileExtension}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(storagePath, image, {
      cacheControl: "3600",
      contentType: image.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload product image: ${error.message}`);
  }

  return storagePath;
}

type CreateProductImageParams = {
  supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>;
  productId: string;
  storagePath: string;
  title: string;
  sortOrder: number;
};

async function createProductImage({
  supabase,
  productId,
  storagePath,
  title,
  sortOrder,
}: CreateProductImageParams): Promise<void> {
  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    storage_path: storagePath,
    alt_text: title,
    sort_order: sortOrder,
  });

  if (error) {
    throw new Error(`Failed to save product image: ${error.message}`);
  }
}

async function removeStorageFile(
  supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>,
  storagePath: string,
): Promise<void> {
  const { error } = await supabase.storage
    .from("product-images")
    .remove([storagePath]);

  if (error) {
    console.error("Failed to remove product image from storage:", error);
  }
}
