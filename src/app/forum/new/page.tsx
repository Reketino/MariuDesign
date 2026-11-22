import Link from "next/link";
import { notFound } from "next/navigation";

import { getForumCategories } from "@/lib/forum/getForumCategories";
import ForumTopicForm from "./ForumTopicForm";

export default async function NewForumTopicPage() {
    const categories = await getForumCategories();

    if (categories.length === 0) {
        notFound();
    }

    return (
        <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
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
                    Start a Discussion
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Share your thoughts, ask questions and connect with the community
                </p>
            </header>

            <section className="rounded-xl border p-6 sm:p-8">
                <ForumTopicForm categories={categories} />
            </section>
        </main>
    )
}