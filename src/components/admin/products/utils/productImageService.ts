import type { ProductImage } from "@/types/products";

type UploadProductImageParams = {
    supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>;
    productId: string;
    image: File;
    title: string;
    existingImage: ProductImage | null;
};

export async function uploadProductImage({
    supabase,
    productId,
    image,
    title,
    existingImage,
}: UploadProductImageParams) {
    const fileExtension =
        image.name.split(".").pop()?.toLowerCase() ?? "jpg";

    const storagePath = `${productId}/${crypto.randomUUID()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(storagePath, image, {
            cacheControl: "3600",
            contentType: image.type,
            upsert: false,
        });

    if (uploadError) {
        throw new Error(
            `Failed to upload product image: ${uploadError.message}`,
        );
    }

    if (existingImage) {
        const { error: updateError } = await supabase
            .from("product_images")
            .update({
                storage_path: storagePath,
                alt_text: title,
                sort_order: existingImage.sort_order,
            })
            .eq("id", existingImage.id);

        if (updateError) {
            await supabase.storage
                .from("product-images")
                .remove([storagePath]);

            throw new Error("Failed to update product image");
        }

        const { error: deleteStorageError } = await supabase.storage
            .from("product-images")
            .remove([existingImage.storage_path]);

        if (deleteStorageError) {
            console.error(
                "Failed to remove old product image:",
                deleteStorageError,
            );
        }

        return;
    }

    const { error: insertError } = await supabase
        .from("product_images")
        .insert({
            product_id: productId,
            storage_path: storagePath,
            alt_text: title,
            sort_order: 0,
        });

    if (insertError) {
        await supabase.storage
            .from("product-images")
            .remove([storagePath]);

        throw new Error("Failed to save product image");
    }
}