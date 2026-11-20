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

                {topic.forum_replies.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-8 text-center">
                        <h3 className="font-semibold">No replies yet</h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Be the first to reply to this discussion.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {topic.forum_replies.map((reply) => {
                            const formattedReplyDate = new Intl.DateTimeFormat("en-GB", {
                                dateStyle: "long",
                                timeStyle: "short",
                            }).format(new Date(reply.created_at));

                            return (
                                <article
                                    key={reply.id}
                                    className="rounded-xl border p-5"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        {reply.is_official && (
                                            <span className="text-xs font-medium text-primary">
                                                Official Reply
                                            </span>
                                        )}
                                        <time
                                            dateTime={reply.created_at}
                                            className="text-xs text-muted-foreground"
                                        >
                                            {formattedReplyDate}
                                        </time>
                                    </div>

                                    <p className="mt-4 whitespace-pre-wrap leading-7">
                                        {reply.content}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}