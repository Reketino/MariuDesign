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

    const fieldClassName = `
    w-full rounded-lg border border-neutral-700 
    bg-neutral-900 px-4 py-3 text-sm text-white 
    placeholder:text-neutral-500 transition-colors 
    focus-visible:border-neutral-500 focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-primary
    `;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label
                htmlFor="reply-content"
                className="block text-sm font-medium text-neutral-200"
                >
                    Your Reply
                </label>

                <textarea
                id="reply-content"
                name="content"
                required
                minLength={2}
                maxLength={10000}
                rows={5}
                placeholder="Write your reply..."
                className={`${fieldClassName} resize-y`}
                />
            </div>

            {error && (
                <p role="alert" className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="flex justify-end">
                <button
                type="submit"
                disabled={isPending}
                className="
                rounded-lg bg-white px-5 py-2.5 text-sm font-semibold 
                text-neutral-950 transition-colors hover:bg-neutral-200 
                disabled:cursor-not-allowed disabled:opacity-50
                "
                >
                    {isPending ? "Posting..." : "Post Reply"}
                </button>
            </div>
        </form>
    )


    
}