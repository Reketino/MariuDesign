"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type DeleteCategoryButtonProps = {
    categoryId: string;
    categoryName: string;
};

export default function DeleteCategoryButton({
    categoryId,
    categoryName,
})