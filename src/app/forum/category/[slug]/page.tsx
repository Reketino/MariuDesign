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
            </section>
        </main>
    )
}