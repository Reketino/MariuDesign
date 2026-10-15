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

function getFileLabel(fileName: string) {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
        case "zip":
            return "ZIP archive";
        case "3mf":
            return "3D model (.3mf)";
        case "stl":
            return "3D model (.stl)";
        case "obj":
            return "3D model (.obj)";
        default:
            return "Product file";
    }
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
                No download files are available for this product.
            </p>
        );
    }


    return (
        <div className="divide-y divide-zinc-800/80">
            {files.map((file) => (
                <div
                    key={file.id}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="
                    flex size-10 shrink-0 items-center justify-center
                    rounded-lg border border-zinc-800 bg-zinc-900
                    "
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="size-5 text-zinc-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                            />

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 2v6h6M8 13h8M8 17h5"
                            />
                        </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className=" text-sm font-medium text-zinc-100">
                            {getFileLabel(file.fileName)}
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
                        inline-flex shrink-0 items-center gap-2 rounded-lg 
                        border border-zinc-700 px-3 py-2 
                        text-xs font-medium text-zinc-200 
                        transition hover:border-zinc-500 hover:bg-zinc-900 
                        disabled:cursor-not-allowed disabled:opacity-50
                    "
                    >
                        {downloadingFileId === file.id
                            ? "Preparing..."
                            : "Download"}
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="size-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                            />
                        </svg>
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