import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { error } from "console";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function DELETE(
    _request: Request,
    { params }: RouteContext
) {
    try {
        await requireAdmin();
    } catch {
        return NextResponse.json(
            { error: "Unathorized" },
            { status: 401 }
        );
    }
    
}