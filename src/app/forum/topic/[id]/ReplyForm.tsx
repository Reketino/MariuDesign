"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createForumReplyAction } from "@/app/actions/forum/createForumReplyAction";

type ReplyFormProps = {
    topicId: string;
};

export default function ReplyForm({ topicId }: ReplyFormProps) {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const form = event.currentTarget;
        const formData = new FormData(form);

        formData.set("topicId", topicId);

        startTransition(async () => {
            const result = await createForumReplyAction(formData);

            if (!result.success) {
                setError(result.error);
                return;
            }

            form.reset();
            router.refresh();
        });
    }
    
}