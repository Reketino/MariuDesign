"use client";

import { useEffect, useState } from "react";

type DownloadFile = {
    id: string;
    fileName: string;
    version: string;
    url: string;
}

type DownloadProductButtonProps = {
    slug: string;
}

export default function DownloadProductButton({
    slug,
}: DownloadProductButtonProps) {
    const [files, setFiles] = useState<DownloadFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadFiles() {
            setIsLoading(true);
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

                if (!cancelled) {
                    setFiles(data.files ?? []);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "Failed to load download files."
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadFiles();

        return () => {
            cancelled = true;
        };
    }, [slug]);

    function handleDownload(file: DownloadFile) {
        setDownloadingFileId(file.id);
        setError(null);

        try {
            const link = document.createElement("a");

            link.href = file.url;
            link.download = file.fileName;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (downloadError) {
            console.error("Download failed:", downloadError);

            setError(
                downloadError instanceof Error
                    ? downloadError.message
                    : "Failed to start download.",
            );
        } finally {
            setDownloadingFileId(null);
        }
    }

    if (isLoading) {
        return (
            <p className="text-sm text-zinc-400">
                Loading download files...
            </p>
        );
    }

    if (error && files.length === 0) {
        return (
            <p role="alert" className="text-sm text-red-400">
                {error}
            </p>
        );
    }

    if (files.length === 0) {
        return (
            <p className="text-sm text-zinc-400">
                No download files are avaliabel for this product.
            </p>
        );
    }


    return (
        <div className="space-y-3">
            {files.map((file) => (
                <div
                    key={file.id}
                    className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="min-w-0">
                        <p className="wrap-break-word text-sm font-medium text-white">
                            {file.fileName}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                            Version {file.version}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleDownload(file)}
                        disabled={downloadingFileId !== null}
                        className="
                    shrink-0 rounded-lg bg-white px-5 py-3 text-sm 
                    font-medium text-zinc-950 transition 
                    hover:bg-zinc-200 disabled:cursor-not-allowed 
                    disabled:opacity-50
                    "
                    >
                        {downloadingFileId === file.id
                            ? "Preparing download..."
                            : `Download ${file.fileName}`}
                    </button>
                </div>
            ))}

            {error && (
                <p role="alert" className="text-sm text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}