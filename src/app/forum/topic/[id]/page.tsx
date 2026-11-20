import Link from "next/link";
import { notFound } from "next/navigation";

import { getForumTopicById } from "@/lib/forum/getForumTopicById";

type ForumTopicPageProps = {
    params: Promise<{
        id: string;
    }>
};

export default async function ForumTopicPage({
    params,
}: ForumTopicPageProps) {
    const { id } = await params;

    const topic = await getForumTopicById(id);

    if (!topic) {
        notFound();
    }

    const formattedTopicDate = new.Intl.DateTimeFormat("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(new Date(topic.created_at));
}