
import Link from "next/link";
import { notFound } from "next/navigation";

import { getForumCategoryBySlug } from "@/lib/forum/getForumCategoryBySlug";
import { GetForumTopics } from "@/lib/forum/getForumTopics";

type ForumCategoryPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ForumCategoryPage({
    params,
}: ForumCategoryPageProps) {
    const { slug } = await params;

    const category = await getForumCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const topics = await GetForumTopics({
        categoryId: category.id,
        limit: 20,
    });

    return (
        <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-12">
                <Link
                    href="/forum"
                    className="mb-8 inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:bg-neutral-900 hover:text-white"
                >
                    <span aria-hidden="true">←</span>
                    Back to Forum
                </Link>

                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    MariuDesign Community
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-white">
                    {category.name}
                </h1>

                {category.description && (
                    <p className="mt-3 max-w-2xl text-neutral-400">
                        {category.description}
                    </p>
                )}
            </header>

            <section aria-labelledby="topics-heading">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2
                            id="topics-heading"
                            className="text-2xl font-semibold text-white"
                        >
                            Discussions
                        </h2>

                        <p className="mt-1 text-sm text-neutral-400">
                            Conversations in {category.name}.
                        </p>
                    </div>

                    <Link
                        href="/forum/new"
                        className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
                    >
                        New Discussion
                    </Link>
                </div>

                {topics.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-950 px-6 py-12 text-center">
                        <h3 className="font-semibold text-neutral-100">
                            No discussions yet
                        </h3>

                        <p className="mt-2 text-sm text-neutral-400">
                            Be the first to start a discussion in this category.
                        </p>

                        <Link
                            href="/forum/new"
                            className="mt-5 inline-flex rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-900"
                        >
                            Start a Discussion
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-800 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
                        {topics.map((topic) => (
                            <Link
                                key={topic.id}
                                href={`/forum/topic/${topic.id}`}
                                className="group block p-5 transition-colors hover:bg-neutral-900"
                            >
                                <article>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {topic.is_pinned && (
                                            <span className="rounded-md bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-200">
                                                Pinned
                                            </span>
                                        )}

                                        {topic.is_locked && (
                                            <span className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-400">
                                                Locked
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-2 font-semibold text-neutral-100 transition-colors group-hover:text-white">
                                        {topic.title}
                                    </h3>

                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-400">
                                        {topic.content}
                                    </p>

                                    <p className="mt-3 text-xs text-neutral-500">
                                        {topic.forum_replies.length} replies
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
