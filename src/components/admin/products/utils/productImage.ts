import type { ProductImage } from "@/types/products";

export function getProductImage(
    images: ProductImage[] | null,
): ProductImage | null {
    if (!images) {
        return null;
    }

    return (
        images
            .filter((image) => image.sort_order >= 0)
            .sort((a, b) => a.sort_order - b.sort_order)[0] ?? null
    );
}

export function getProductImageUrl(storagePath: string) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
}
