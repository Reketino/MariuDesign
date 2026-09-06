const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export function validateProductImage(file: File): string | null {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return "Invalid image type. Please use JPG, PNG or WebP.";
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return "Image is too large. Maximum file size is 5 MB.";
    }

    return null;
}