"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createForumTopicAction } from "@/app/actions/forum/createForumTopicAction";
import type { ForumCategory } from "@/types/forum";

type ForumTopicFormProps = {
    categories: ForumCategory[];
};

export default function ForumTopicForm({
    categories,
}: ForumTopicFormProps) {
    const router = useRouter();

    const [ispending, startTransition] = useTransition();
}