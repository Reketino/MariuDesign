import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function AdminPage() {
    const { user } = await requireAdmin();

    return (
    <main>
        <h1>Mariudesign Admin</h1>

        <p>
            Logged in as: {user.email}
        </p>
    </main>
    )
}