"use client";

import { useState, useTransition } from "react";
import {
    toggleTopicPinAction,
    toggleTopicLockAction,
} from "@/lib/forum/actions/topicModeration";

type AdminActionsProps = {
    topicId: string;
    isPinned: boolean;
    isLocked: boolean;
};

export default function AdminActions({
    topicId,
    isPinned,
    isLocked,
}: AdminActionsProps) {
    
}