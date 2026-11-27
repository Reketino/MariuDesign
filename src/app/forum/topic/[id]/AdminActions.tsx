"use client";

import { useState, useTransition } from "react";
import {
    toggleTopicPinAction,
    toggleTopicLockAction,
} from "@/lib/forum/actions/topicModeration";