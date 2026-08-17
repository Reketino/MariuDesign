import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return <main>
        <h1>Mariudesign Admin</h1>

        <p>
            Logged in as: {user?.email}
        </p>
    </main>
}