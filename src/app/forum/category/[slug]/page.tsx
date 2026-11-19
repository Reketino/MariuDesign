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
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10">
                <Link
                    href="/forum"
                    className="mb-6 inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    ← Back to Forum
                </Link>

                <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                    MariuDesign Community
                </p>

                <h1 className="text-4xl font-bold tracking-tight">
                    {category.name}
                </h1>

                {category.description && (
                    <p className="mt-3 max-w-2xl text-muted-foreground">
                        {category.description}
                    </p>
                )}
            </header>

            <section aria-labelledby="topics-heading">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 id="topics-heading" className="text-2xl font-semibold">
                        Discussions
                    </h2>
                </div>

                {topics.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                        <h3 className="font-semibold">No discussions yet</h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Be the first to start a discussion in this category.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y rounded-xl border">
                        {topics.map((topic) => (
                            <Link
                                key={topic.id}
                                href={`/forum/topic/${topic.id}`}
                                className="block p-5 transition-colors hover:bg-muted/50"
                            >
                                <article>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {topic.is_pinned && (
                                            <span className="text-xs font-medium text-primary">
                                                Pinned
                                            </span>
                                        )}

                                        {topic.is_locked && (
                                            <span className="text-xs text-muted-foreground">
                                                Locked
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-2 font-semibold transition-colors group-hover:text-primary">
                                    {topic.title}
                                    </h3>

                                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                        {topic.content}
                                    </p>

                                    <p className="mt-3 text-xs text-muted-foreground">
                                        {topic.forum_replies.length} replies
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}