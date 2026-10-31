import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

const navigationLinks = [
    { label: "Store", href: "/shop" },
    { label: "Build Guides", href: "/build-guides" },
    { label: "Part Lists", href: "/part-lists" },
];

export default async function Navbar() {
    const supbase = createClient();

    const { data: { user} } = await supbase.auth.getUser();

    const username =
    user?.user_metadata?.username
    user?.email?.split("@")[0] ??
    null;
}