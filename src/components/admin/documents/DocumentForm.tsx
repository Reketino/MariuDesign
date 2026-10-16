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
    const router = useRouter();

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

        if (sourceType === "pdf" && file) {
            formData.set("file", file);
        }

        if (sourceType === "google_docs") {
            formData.set("externalUrl", externalUrl);
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("api/admin/documents", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                setMessage(result.error ?? "Could not save the document.");
                return;
            }

            setMessage("Document saved successfully.")
            setTitle("");
            setDescription("");
            setExternalUrl("");
            setFile(null);

            const fileInput = document.getElementById("document-file") as HTMLInputElement | null;

            if (fileInput) fileInput.value = "";

            router.refresh();
        } catch {
            setMessage("An unexpected error occured.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6"
        >
            <div>
                <h2 className="text-lg font-semibold text-white">
                    Add document
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                    Add a public build guide or parts list to a product.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                    <span className="mb-2 block text-sm text-zinc-500">
                    Product
                    </span>
                    <select
                    value={productId}
                    onChange={(event) => setProductId(event.target.value)}
                    required
                    className="
                    w-full rounded-lg 
                    border border-zinc-700 
                    bg-zinc-950 px-3 py-2.5 
                    text-sm text-white"                 
                    >
                        <option value="" disabled>
                            Select a product
                        </option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.title}
                            </option>
                        ))}
                    </select>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm text-zinc-300">
                            Document type
                        </span>
                        <select
                        value={documentType}
                        onChange={(event) => 
                            setDocumentType(
                                event.target.value as
                                | "build_guide"
                                | "part_list"
                            )
                        }
                        className="
                        w-full rounded-lg 
                        border border-zinc-700 
                        bg-zinc-950 px-3 py-2.5 
                        text-sm text-white"
                        >
                            <option value="build_guide">Build Guide</option>
                            <option value="part_list">Part List</option>
                        </select>
                    </label>
            </div>
        </form>
    )
}