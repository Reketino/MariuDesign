"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createForumTopic } from "@/lib/forum/createForumTopic";