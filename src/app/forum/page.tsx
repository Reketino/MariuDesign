import { getForumCategories } from "@/lib/forum/getForumCategories";
import { getForumTopics } from "@/lib/forum/getForumTopics";

export default async function ForumPage() {
    const [categories, topics] = await Promise.all([
        getForumCategories(),
        getForumTopics({ limit: 20 }),
    ]);
}
