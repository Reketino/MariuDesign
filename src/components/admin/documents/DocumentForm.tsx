"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Product = {
    id: string;
    title: string;
};

export default function DocumentForm({ products }: {
    products: Product[];
}) {
    const router = useRouter

    const [productId, setProductId] = useState(products[0]?.id ?? "")
    const [documentType, setDocumentType] = useState<
    "build_guide" | "part_list"
    >("build_guide");
    const [sourceType, setSourceType] = useState<"pdf" | "google_docs">("pdf")
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [externalUrl, setExternalUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        if (!productId) {
            setMessage("Choose a product.");
            return;
        }

        if (sourceType === "pdf" && !file) {
            setMessage("Select a PDF file.")
            return;
        }

        if (sourceType === "google_docs" && !externalUrl.trim()) {
            setMessage("Enter a Google Docs URL.");
            return;
        }

        const formData = new FormData();
        formData.set("productId", productId);
        formData.set("documentType", documentType);
        formData.set("sourceType", sourceType);
        formData.set("title", title);
        formData.set("description", description);
        
    }
}