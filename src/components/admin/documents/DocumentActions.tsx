"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DocumentActionsProps = {
    documentId: string;
    documentTitle: string;
}

export default function DocumentActions({
    documentId,
    documentTitle,
}: DocumentActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    
}