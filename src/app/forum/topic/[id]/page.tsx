import Link from "next/link";
import { notFound } from "next/navigation";

import { getForumTopicById } from "@/lib/forum/getForumTopicById";

type ForumTopicPageProps = {
    params: Promise<{
        id: string;
    }>
};

export default async function ForumTopicPage({
    params,
}: ForumTopicPageProps) {
    const { id } = await params;

    const topic = await getForumTopicById(id);

    if (!topic) {
        notFound();
    }

    const formattedTopicDate = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(new Date(topic.created_at));

    return (
        <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-8">
                <Link
                href="/forum"
                className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    ← Back to Forum
                </Link>
            </header>

            <article className="rounded-xl border p-6 sm:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
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

                <h1 className="text-3xl font-bold tracking-tight">
                    {topic.title}
                </h1>

                <p className="mt-3 text-xs text-muted-foreground">
                    Posted on {formattedTopicDate}
                </p>

                <div className="mt-8 whitespace-pre-wrap leading-7">
                    {topic.content}
                </div>
            </article>

            <section aria-labelledby="replies-heading" className="mt-10">
                <h2 id="replies-heading" className="mb-5 text-2xl font-semibold">
                    Replies ({topic.forum_replies.length})
                </h2>

                
            </section>
        </main>
    )
}