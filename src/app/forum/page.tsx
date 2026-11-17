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
                
            </header>
         </main>
    )
}
