"use client";

import { useState } from "react";

import type { ProductFile } from "@/types/products";

type ProductFilesProps = {
    existingFiles: ProductFile[];
    selectedFiles: File[];
    version: string;
    onFilesChange: (files: File[]) => void;
    onVersionChange: (version: string) => void;
    onDeleteExistingFile: (file: ProductFile) => Promise<void>;
};

export default function ProductFiles({
    existingFiles,
    selectedFiles,
    version,
    onFilesChange,
    onVersionChange,
    onDeleteExistingFile,
}: ProductFilesProps) {
     const [deletingFileId, setDeletingFileId] = useState<string | null>(
        null,
    );

    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) {
            return;
        }

        onFilesChange([...selectedFiles, ...files]);

        event.target.value = "";
    }

    function removeSelectedFile(index: number) {
        onFilesChange(
            selectedFiles.filter((_, fileIndex) => fileIndex !== index),
        );
    }

      async function handleDeleteExistingFile(file: ProductFile) {
        setDeletingFileId(file.id);

        try {
            await onDeleteExistingFile(file);
        } finally {
            setDeletingFileId(null);
        }
    }


   return (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <header>
                <h2 className="text-base font-medium text-white">
                    Product files
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Upload the 3D model files customers will receive.
                </p>
            </header>

              <div className="mt-6">
                <label
                    htmlFor="product-version"
                    className="block text-sm font-medium text-zinc-300"
                >
                    Version
                </label>

                <input
                    id="product-version"
                    type="text"
                    value={version}
                    onChange={(event) =>
                        onVersionChange(event.target.value)
                    }
                    placeholder="1.0"
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
                />
            </div>

             <div className="mt-6">
                <label
                    htmlFor="product-files"
                    className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-950 px-6 py-8 text-center transition hover:border-zinc-500 hover:bg-zinc-900"
                >
                    <div>
                        <p className="text-sm font-medium text-zinc-300">
                            Choose 3D model files
                        </p>

                        <p className="mt-1 text-xs text-zinc-600">
                            STL, 3MF, or OBJ
                        </p>
                    </div>
                </label>

                <input
                    id="product-files"
                    type="file"
                    multiple
                    accept=".stl,.3mf,.obj"
                    onChange={handleFileChange}
                    className="sr-only"
                />
            </div>

                        {selectedFiles.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-zinc-300">
                        Files to upload
                    </h3>

                    <ul className="mt-3 divide-y divide-zinc-800 rounded-lg border border-zinc-800">
                        {selectedFiles.map((file, index) => (
                            <li
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between gap-4 px-4 py-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm text-zinc-300">
                                        {file.name}
                                    </p>

                                    <p className="mt-1 text-xs text-zinc-600">
                                        {(file.size / 1024 / 1024).toFixed(
                                            2,
                                        )}{" "}
                                        MB
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeSelectedFile(index)
                                    }
                                    className="shrink-0 text-sm text-zinc-500 transition hover:text-white"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

             {existingFiles.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-sm font-medium text-zinc-300">
                        Uploaded files
                    </h3>

                    <ul className="mt-3 divide-y divide-zinc-800 rounded-lg border border-zinc-800">
                        {existingFiles.map((file) => (
                            <li
                                key={file.id}
                                className="flex items-center justify-between gap-4 px-4 py-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm text-zinc-300">
                                        {file.file_name}
                                    </p>

                                    <p className="mt-1 text-xs text-zinc-600">
                                        Version {file.version}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeleteExistingFile(file)
                                    }
                                    disabled={
                                        deletingFileId === file.id
                                    }
                                    className="shrink-0 text-sm text-zinc-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {deletingFileId === file.id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            </section>
)
}