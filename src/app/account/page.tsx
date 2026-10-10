import Link from "next/link";
import { redirect } from "next/navigation";

import DownloadProductButton from "@/components/admin/products/DownloadProductButton";
import LogoutButton from "@/components/auth/LogoutButton";
import PublicHeader from "@/components/layout/PublicHeader";

import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }
}