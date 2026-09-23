"use client";

import { useState } from "react";

type DownloadProductButtonProps = {
    slug: string;
}

export default function DownloadProductButton({
    slug,
}: DownloadProductButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDownload() {
        setIsDownloading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/products/${encodeURIComponent(slug)}/download`,
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to start download.",
                );
            }
            
            const link = document.createElement("a");

            link.href = data.url;
            link.download = data.fileName;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    }
}