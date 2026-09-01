"use client";

import type { ProductCategory } from "@/types/products";

type ProductStoreSettingsProps = {
    categories: ProductCategory[];
    categoryId: string;
    status: string;
    license: string;
    onCategoryChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onLicenseChange: (value: string) => void;
};

export default function ProductStoreSettings({
    categories,
    categoryId,
    status,
    license,
    onCategoryChange,
    onStatusChange,
    onLicenseChange,
}: ProductStoreSettingsProps) {
    return (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
            <header>
                <h2 className="text-lg font-semibold text-white">
                    Store settings
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Configure how the product appears in your store.
                </p>
            </header>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="category"
                        className="block text-sm font-medium text-zinc-300"
                    >
                        Category
                    </label>

                    <select
                        id="category"
                        name="category"
                        value={categoryId}
                        onChange={(event) =>
                            onCategoryChange(event.target.value)
                        }
                        className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-500"
                    >
                        <option value="">
                            Uncategorized
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium text-zinc-300"
                        >
                            Status
                        </label>

                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(event) =>
                                onStatusChange(event.target.value)
                            }
                            className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-500"
                        >
                            <option value="draft">
                                Draft
                            </option>

                            <option value="published">
                                Published
                            </option>

                            <option value="archived">
                                Archived
                            </option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="license"
                            className="block text-sm font-medium text-zinc-300"
                        >
                            License
                        </label>

                        <select
                            id="license"
                            name="license"
                            value={license}
                            onChange={(event) =>
                                onLicenseChange(event.target.value)
                            }
                            required
                            className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-500"
                        >
                            <option value="">
                                Select a license
                            </option>

                            <option value="personal">
                                Personal use
                            </option>

                            <option value="commercial">
                                Commercial use
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
}