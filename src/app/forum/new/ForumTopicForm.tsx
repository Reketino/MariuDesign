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

    const [isPending, startTransition] = useTransition();
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

            router.push(`/forum/topic/${result.topicId}`);
            router.refresh();
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="categoryId" className="text-sm font-medium">
                    Category
                </label>

                <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue=""
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                    <option value="" disabled>
                        Select a category
                    </option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                    Title
                </label>

                <input
                id="title"
                name="title"
                type="text"
                required
                minLength={3}
                maxLength={150}
                placeholder="What would you like to discuss?"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                    Description
                </label>

                <textarea
                id="content"
                name="content"
                required
                minLength={10}
                maxLength={10000}
                rows={8}
                placeholder="Share the details of your discussion.."
                />
            </div>

            {error && (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}

            <div className="flex items-center justify-end gap-3">
                <button
                type="button"
                onClick={() => router.back()}
                disabled={isPending}
                className="
                rounded-lg border px-4 py-2 
                text-sm font-medium transition-colors 
                hover:bg-muted disabled:opacity-50
                "
                >
                    Cancel
                </button>

                <button
                type="submit"
                disabled={isPending || categories.length === 0}
                className="
                rounded-lg bg-primary px-5 py-2 
                text-sm font-medium text-primary-foreground 
                transition-opacity hover:opacity-90 
                disabled:cursor-not-allowed disabled:opacity-50
                "
                >
                    {isPending ? "Creating..." : "Create Discussion"}
                </button>
            </div>
        </form>
    )
}