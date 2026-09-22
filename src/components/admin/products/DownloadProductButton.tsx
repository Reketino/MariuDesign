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
}