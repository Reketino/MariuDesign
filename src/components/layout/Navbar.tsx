import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

const navigationLinks = [
    { label: "Store", href: "/shop" },
    { label: "Build Guides", href: "/build-guides" },
    { label: "Part Lists", href: "/part-lists" },
];

