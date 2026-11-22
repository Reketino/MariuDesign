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
                
            </header>
        </main>
    )
}