
"use server";

import { revalidatePath } from "next/cache";

import { createForumReply } from "@/lib/forum/createForumReply";