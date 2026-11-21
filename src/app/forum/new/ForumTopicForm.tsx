"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createForumTopicAction } from "@/app/actions/forum/createForumTopicAction";
import type { ForumCategory } from "@/types/forum";

type ForumTopicFormProps = {
    categories: ForumCategory[];
};

export default function ForumTopicForm({
    categories,
}: ForumTopicFormProps) {
    const router = useRouter();

    const [ispending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await createForumTopicAction(formData);
            
            if (!result.success) {
                setError(result.error);
                return;
            }
        })
    }
}