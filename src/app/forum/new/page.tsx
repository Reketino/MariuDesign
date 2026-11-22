
import Link from "next/link";

import { getForumCategories } from "@/lib/forum/getForumCategories";
import ForumTopicForm from "./ForumTopicForm";

export default async function NewForumTopicPage() {
    const categories = await getForumCategories();

    return (
        <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10">
                <Link
                    href="/forum"
                    className="mb-8 inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-neutral-900"
                >
                    <span aria-hidden="true">←</span>
                    Back to Forum
                </Link>

                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    MariuDesign Community
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-white">
                    Start a Discussion
                </h1>

                <p className="mt-3 max-w-xl text-neutral-400">
                    Share your thoughts, ask questions and connect with the community.
                </p>
            </header>

            <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-neutral-100 shadow-lg sm:p-8">
                <ForumTopicForm categories={categories} />
            </section>
        </main>
    );
}
