import type { ProductImage } from "@/types/products";

export function getProductImage(
    images: ProductImage[] | null,
): ProductImage | null {
    if (!images) {
        return null;
    }
}