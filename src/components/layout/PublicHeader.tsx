import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/dist/server/api-utils";

export default async function PublicHeader() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }
}