"use client";

type ProductImagesProps = {
    image: File | null;
    error: string;
    onImageChange: (
        event: React.ChangeEvent<HTMLInputElement>,
    
    ) => void;
};

export default function ProductImages({
    image,
    error,
    onImageChange,
}: ProductImagesProps) {
    
}