"use client";

type ProductImagesProps = {
    image: File | null;
    error: string;
    onImageChange: (
        event: React.ChangeEvent<HTMLInputElement>,
    
    ) => void;
};