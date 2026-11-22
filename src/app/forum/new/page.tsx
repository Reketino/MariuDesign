import Link from "next/link";
import { notFound } from "next/navigation";

import { getForumCategories } from "@/lib/forum/getForumCategories";
import ForumTopicForm from "./ForumTopicForm";

export default async function NewForumTopicPage() {
    const categories = await getForumCategories();
    
    if (categories.length === 0) {
        notFound();
    }
    
}