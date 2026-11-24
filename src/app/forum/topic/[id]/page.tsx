
import Link from "next/link";
import { notFound } from "next/navigation";

import ReplyForm from "./ReplyForm";
import { getForumTopicById } from "@/lib/forum/getForumTopicById";
import { createClient } from "@/lib/supabase/server";

type ForumTopicPageProps = {
    params: Promise<{
        id: string;
    }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
});

export default async function ForumTopicPage({
    params,
}: ForumTopicPageProps) {
    const { id } = await params;

    const topic = await getForumTopicById(id);

    if (!topic) {
        notFound();
    }

    const formattedTopicDate = dateFormatter.format(
        new Date(topic.created_at)
    );

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10">
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
            </header>

            <article className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                    {topic.is_pinned && (
                        <span className="rounded-md bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-200">
                            Pinned
                        </span>
                    )}

                    {topic.is_locked && (
                        <span className="rounded-md bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-400">
                            Locked
                        </span>
                    )}
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {topic.title}
                </h1>

                <time
                    dateTime={topic.created_at}
                    className="mt-4 block text-sm text-neutral-500"
                >
                    Posted on {formattedTopicDate}
                </time>

                <p className="mt-2 text-sm text-neutral-400">
                    Started by{" "}
                    <span className="font-medium text-neutral-200">
                        {topic.author_username ?? "Unknown user"}
                    </span>
                </p>

                <div className="mt-8 border-t border-neutral-800 pt-8">
                    <p className="whitespace-pre-wrap text-base leading-8 text-neutral-300">
                        {topic.content}
                    </p>
                </div>
            </article>

            <section aria-labelledby="replies-heading" className="mt-12">
                <div className="mb-6">
                    <h2
                        id="replies-heading"
                        className="text-2xl font-semibold text-white"
                    >
                        Replies ({topic.forum_replies.length})
                    </h2>

                    <p className="mt-1 text-sm text-neutral-400">
                        Responses from the community.
                    </p>
                </div>

                {topic.forum_replies.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-950 px-6 py-12 text-center">
                        <h3 className="font-semibold text-neutral-100">
                            No replies yet
                        </h3>

                        <p className="mt-2 text-sm text-neutral-400">
                            Be the first to reply to this discussion.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {topic.forum_replies.map((reply) => {
                            const formattedReplyDate = dateFormatter.format(
                                new Date(reply.created_at)
                            );

                            return (
                                <article
                                    key={reply.id}
                                    className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-semibold text-neutral-200">
                                                {reply.username ?? "Unknown user"}
                                            </span>

                                            {reply.is_official && (
                                                <span className="
                                                rounded-md border border-neutral-700 
                                                bg-neutral-900 px-2 py-1 text-xs 
                                                font-medium text-neutral-300
                                                "
                                                >
                                                    Official
                                                </span>
                                            )}
                                        </div>
                                        <time
                                            dateTime={reply.created_at}
                                            className="text-xs text-neutral-500"
                                        >
                                            {formattedReplyDate}
                                        </time>
                                    </div>

                                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral-300">
                                        {reply.content}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
            <section
                id="reply-form-heading"
                className="mb-5 text-xl font-semibold text-white"
            >
                {topic.is_locked ? (
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
                        <h3 className="font-semibold text-neutral-100">
                            Discussion Locked
                        </h3>

                        <p className="mt-2 text-sm text-neutral-400">
                            This discussion is locked and no longer accepts replies.
                        </p>
                    </div>
                ) : user ? (
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
                        <h2 className="mb-5 text-xl font-semibold text-white">
                            Join the Discussion
                        </h2>

                        <ReplyForm topicId={topic.id} />
                    </div>
                ) : (
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
                        <h3 className="font-semibold text-neutral-400">
                            Want to join the discussion?
                        </h3>

                        <p className="mt-2 text-sm text-neutral-400">
                            Sign in to reply to this discussion.
                        </p>

                        <Link
                            href={`/login?next=/forum/topic/${topic.id}`}
                            className="
                        mt-5 inline-flex rounded-lg bg-white 
                        px-4 py-2.5 text-sm font-semibold 
                        text-neutral-950 transition-colors 
                        hover:bg-neutral-200
                        "
                        >
                            Sign In
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}
