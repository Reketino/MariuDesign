"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createForumReplyAction } from "@/app/actions/forum/createForumReplyAction";

type ReplyFormProps = {
    topicId: string;
}