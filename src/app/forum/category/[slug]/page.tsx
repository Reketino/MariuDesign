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
    
}