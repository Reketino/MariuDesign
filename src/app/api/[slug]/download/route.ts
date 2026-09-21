import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
    params: Promise<{
        slug: string;
    }>;
};