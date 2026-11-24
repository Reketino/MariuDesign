
"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
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

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    const fieldClassName =
        `w-full rounded-lg border border-neutral-700 
        bg-neutral-900 px-4 py-3 text-sm text-white 
        placeholder:text-neutral-500 transition-colors 
        focus-visible:border-neutral-500 
        focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-primary`;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-neutral-200"
                >
                    Category
                </label>

                <select
                    id="categoryId"
                    name="categoryId"
                    required
                    defaultValue=""
                    className={`${fieldClassName} scheme-dark`}
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
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-neutral-200"
                >
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
                    className={fieldClassName}
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="content"
                    className="block text-sm font-medium text-neutral-200"
                >
                    Description
                </label>

                <textarea
                    id="content"
                    name="content"
                    required
                    minLength={10}
                    maxLength={10000}
                    rows={8}
                    placeholder="Share the details of your discussion..."
                    className={`${fieldClassName} resize-y`}
                />
            </div>

            {error && (
                <p role="alert" className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-neutral-800 pt-5">
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isPending}
                    className="rounded-lg border border-neutral-700 
          px-4 py-2.5 text-sm font-medium text-neutral-300 
          transition-colors hover:bg-neutral-900 
          disabled:opacity-50
          "
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isPending || categories.length === 0}
                    className="
          rounded-lg bg-white px-5 py-2.5 text-sm 
          font-semibold text-neutral-950 transition-colors 
          hover:bg-neutral-200 disabled:cursor-not-allowed 
          disabled:opacity-50
          "
                >
                    {isPending ? "Creating..." : "Create Discussion"}
                </button>
            </div>
        </form>
    );
}
