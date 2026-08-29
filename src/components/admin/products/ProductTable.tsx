import Link from "next/link";

import DeleteProductButton from "./DeleteProductButton";

import type { Product, ProductCategory } from "@/types/products";

type ProductTableProps = {
    products: Product[];
};

function getCategory(
    categories: Product["categories"],
): ProductCategory | null {
    if (!categories) {
        return null;
    }

    return categories[0] ?? null;
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
}

function getStatusClasses(status: string) {
    switch (status.toLowerCase()) {
        case "published":
            return "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20";

        case "draft":
            return "bg-zinc-800 text-zinc-400 ring-1 ring-inset ring-zinc-700";

        case "archived":
            return "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20";

        default:
            return "bg-zinc-800 text-zinc-400 ring-1 ring-inset ring-zinc-700";
    }
}

export default function ProductTable({
    products,
}: ProductTableProps) {
    if (products.length === 0) {
        return (
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60">
                <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                        <span className="text-xl text-zinc-500">
                            +
                        </span>
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-white">
                        No products yet
                    </h2>


                    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                        You have not added any 3D models to your store yet.
                        Create your first product to get started.
                    </p>

                    <Link
                        href="/admin/products/new"
                        className="mt-6 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                    >
                        Add your first product
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
            <div className="overflow-x-auto">
                <table className="w-full min-w-200 text-left">
                    <thead className="border-b border-zinc-800 bg-zinc-900">
                        <tr>
                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                                Product
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                                Category
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                                Status
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                                Created
                            </th>

                            <th className="px-6 py-4 text-right font-medium uppercase tracking-wider text-zinc-500">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-800">
                        {products.map((product) => {
                            const category = getCategory(
                                product.categories,
                            );

                            return (
                                <tr
                                    key={product.id}
                                    className="transition hover:bg-zinc-900"
                                >
                                    <td className="px-6 py-5">
                                        <div>
                                            <p className="font-medium text-white">
                                                {product.title}
                                            </p>

                                            <p className="mt-1 text-sm text-zinc-500">
                                                /{product.slug}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <span className="text-sm text-zinc-400">
                                            {category?.name ?? "Uncategorized"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize
                                            ${getStatusClasses(product.status,)}`}>
                                            {product.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5">
                                        <span className="text-sm text-zinc-500">
                                            {formatDate(product.created_at)}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5 text-right">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="text-sm font-medium text-zinc-400 transition hover:text-white"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
