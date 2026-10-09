"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function LogoutButton() {
        setLoading(true);

        const supabase = createClient();

        const { error } = await supabase.auth.signOut();
    }
}