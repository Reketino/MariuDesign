import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
        .from("categories")
        .select("*");

    if (error) {
        return (
            <main>
                <h1>Supabase connection failed</h1>
                <p>{error.message}</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Mariudesign</h1>

            <p>Supabase connection successful.</p>

            <pre>{JSON.stringify(categories, null, 2)}</pre>
        </main>
    );
}