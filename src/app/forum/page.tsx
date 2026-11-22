import Link from "next/link";

import { getForumCategories } from "@/lib/forum/getForumCategories";
import { GetForumTopics } from "@/lib/forum/getForumTopics";

export default async function ForumPage() {
    const [categories, topics] = await Promise.all([
        getForumCategories(),
        GetForumTopics({ limit: 20 }),
    ]);

    return (
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10">
                <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                    MariuDesign Community
                </p>

                <h1 className="text-4xl font-bold tracking-tight">
                    Community Forum
                </h1>

                <p className="mt-3 max-w-2xl text-muted-foreground">
                    Ask questions, share experiences and connect with the MariuDesign
                    community.
                </p>
            </header>

            <section aria-labelledby="categories-heading" className="mb-12">
                <h2
                    id="categories-heading"
                    className="mb-5 text-2xl font-semibold"
                >
                    Categories
                </h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/forum/category/${category.slug}`}
                            className="group rounded-xl border p-5 transition-colors hover:bg-muted/50"
                        >
                            <article>
                                <h3 className="font-semibold transition-colors group-hover:text-primary">
                                    {category.name}
                                </h3>

                                {category.description && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {category.description}
                                    </p>
                                )}
                            </article>
                        </Link>
                    ))}
                </div>
            </section>

            <section aria-labelledby="topics-heading">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <h2 id="topics-heading" className="text-2xl font-semibold">
                        Latest Discussions
                    </h2>
                </div>

                {topics.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                        <h3 className="font-semibold">No discussions yet</h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Be the first to start a discussion in the community.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y rounded-xl border">
                        {topics.map((topic) => (
                            <Link
                                key={topic.id}
                                href={`/forum/topic/${topic.id}`}
                                className="group block p-5 transition-colors hover:bg-muted/50"
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
    );
}