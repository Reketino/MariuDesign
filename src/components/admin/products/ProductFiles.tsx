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
