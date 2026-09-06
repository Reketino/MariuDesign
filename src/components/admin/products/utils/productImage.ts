import type { ProductImage } from "@/types/products";

export function getProductImages(
    images: ProductImage[] | null,
): ProductImage[] {
    if (!images) {
        return [];
    }

    return [...images]
        .filter((image) => image.sort_order >= 0)
        .sort((a, b) => a.sort_order - b.sort_order);
}

export function getProductImage(
    images: ProductImage[] | null,
): ProductImage | null {
    return getProductImages(images)[0] ?? null;
}

export function getProductImageUrl(storagePath: string): string {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
}