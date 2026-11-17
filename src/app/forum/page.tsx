import { getForumCategories } from "@/lib/forum/getForumCategories";
import { getForumTopics } from "@/lib/forum/getForumTopics";

export default async function ForumPage() {
    const [categories, topics] = await Promise.all([
        getForumCategories(),
        getForumTopics({ limit: 20 }),
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

                <section aria-labelledby="categroies-heading" className="mb-12">
                    <h2
                    id="categories-heading"
                    className="mb-5 text-2xl font-semibold"
                    >
                        Categories
                    </h2>
                </section>
                
            </header>
         </main>
    )
}
