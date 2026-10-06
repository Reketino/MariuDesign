"use client";

import { useState } from "react";

type BuyProductButtonProps = {
    slug: string;
    price: number;
    currency: string;
};

export default function BuyProductButton({
    slug,
    price,
    currency,
}: BuyProductButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleCheckout() {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/checkout/${encodeURIComponent(slug)}`,
                {
                    method: "POST",
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to start checkout.",
                );
            }

            if (!data.url) {
                throw new Error(
                    "Checkout URL was not returned.",
                );
            }

            window.location.href = data.url;
        } catch (checkoutError) {
            console.error(
                "Checkout failed:",
                checkoutError,
            );

            setError(
                checkoutError instanceof Error
                    ? checkoutError.message
                    : "Failed to start checkout.",
            );

            setIsLoading(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full rounded-lg bg-white px-5 py-3.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading
                    ? "Opening checkout..."
                    : `Buy for ${price.toFixed(2)} ${currency}`}
            </button>

            {error && (
                <p
                    role="alert"
                    className="mt-3 text-center text-xs text-red-400"
                >
                    {error}
                </p>
            )}
        </div>
    );
}