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
  supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>;
  image: ProductImage;
};

export async function deleteProductImage({
    supabase,
    image,
}: DeleteProductImageParams): Promise<void> {
    const { data, error: deleteDatabaseError } = await supabase
        .from("product_images")
        .delete()
        .eq("id", image.id)
        .eq("product_id", image.product_id)
        .select("id")
        .maybeSingle();

    if (deleteDatabaseError) {
        throw new Error(
            `Failed to delete product image: ${deleteDatabaseError.message}`,
        );
    }

    if (!data) {
        throw new Error(
            "Product image could not be deleted. The image may not exist or you may not have permission to delete it.",
        );
    }

    const { data: remainingImages, error: fetchError } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", image.product_id)
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

    if (fetchError) {
        throw new Error(
            `Product image was deleted, but the remaining image order could not be loaded: ${fetchError.message}`,
        );
    }

    for (const [index, remainingImage] of remainingImages.entries()) {
        const { error: updateError } = await supabase
            .from("product_images")
            .update({
                sort_order: index,
            })
            .eq("id", remainingImage.id)
            .eq("product_id", image.product_id);

        if (updateError) {
            throw new Error(
                `Product image was deleted, but the image order could not be updated: ${updateError.message}`,
            );
        }
    }

    const { error: deleteStorageError } = await supabase.storage
        .from("product-images")
        .remove([image.storage_path]);

    if (deleteStorageError) {
        console.error(
            "Product image was removed from the database, but could not be removed from storage:",
            deleteStorageError,
        );
    }
}

type SetProductImageAsMainParams = {
    supabase: ReturnType<
        typeof import("@/lib/supabase/client").createClient
    >;
    productId: string;
    imageId: string;
};

export async function setProductImageAsMain({
    supabase,
    productId,
    imageId,
}: SetProductImageAsMainParams): Promise<void> {
    const { data: images, error: fetchError } = await supabase
        .from("product_images")
        .select("id, sort_order")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

    if (fetchError) {
        throw new Error(
            `Failed to load product images: ${fetchError.message}`,
        );
    }

    const imageExists = images.some(
        (image) => image.id === imageId,
    );

    if (!imageExists) {
        throw new Error(
            "The selected product image could not be found.",
        );
    }

    const { error: temporaryUpdateError } = await supabase
        .from("product_images")
        .update({
            sort_order: -1,
        })
        .eq("id", imageId)
        .eq("product_id", productId);

    if (temporaryUpdateError) {
        throw new Error(
            `Failed to prepare the main image: ${temporaryUpdateError.message}`,
        );
    }

    const remainingImages = images.filter(
        (image) => image.id !== imageId,
    );

    for (const [index, image] of remainingImages.entries()) {
        const { error: updateError } = await supabase
            .from("product_images")
            .update({
                sort_order: index + 1,
            })
            .eq("id", image.id)
            .eq("product_id", productId);

        if (updateError) {
            throw new Error(
                `Failed to update product image order: ${updateError.message}`,
            );
        }
    }

    const { error: mainImageError } = await supabase
        .from("product_images")
        .update({
            sort_order: 0,
        })
        .eq("id", imageId)
        .eq("product_id", productId);

    if (mainImageError) {
        throw new Error(
            `Failed to set the main product image: ${mainImageError.message}`,
        );
    }
}

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
