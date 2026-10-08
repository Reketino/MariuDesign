"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();
        
        setError("");
        setSuccess("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("password do not match.");
            return;
        }

        setLoading(true);

        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        if (data.session) {
            router.push("/shop");
            router.refresh();
            return;
        }

        setSuccess(
            "Account created. Please check your email to confirrm account."
        );

        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-300"
                >
                    Email
                </label>
            </div>
        </form>
    )
}