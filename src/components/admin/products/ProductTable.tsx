import Image from "next/image";
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

function getProductImage(
    images: Product["product_images"]
) {
    if (!images) {
        return null;
    }

    return (
        images
            .filter((image) => image.sort_order >= 0)
            .sort((a, b) => a.sort_order - b.sort_order)[0] ?? null
    );
}

function getProductImageUrl(storagePath: string) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
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

function ProductPlaceholder() {
    return (
        <div className="
        flex size-12 shrink-0 items-center justify-center 
        rounded-lg border border-white/[0.07] bg-white/3 
        text-zinc-600
        "
        >
            <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-5"
            >
                <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                <path d="m3 8 9 5 9-5M3 8v8l9 5 9-5V8" />
            </svg>
        </div>
    );
}

function EmptyProducts() {
    return (
        <section className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#111111]">
            <div className="flex flex-col items-center px-6 py-20 text-center">
                <span className="flex size-14 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-zinc-400">
                <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-6"
                >
                    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                    <path d="m3 8 9 5 9-5M3 8v8l9 5 9-5V8" />
                </svg>
                </span>

                <h3 className="mt-5 text-base font-semibold text-white">
                    No products yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                    Your product catalog is currently empty. Add your first 
                    3D model to get started.
                </p>

                <Link 
                href="/admin/products/new"
                className="
                mt-6 inline-flex items-center gap-2 
                rounded-lg bg-white px-4 py-2.5 
                text-sm font-medium text-zinc-950 
                transition hover:bg-zinc-200
                "
                >
                    <span aria-hidden="true">+</span>
                    Add your first product
                </Link>
            </div>
        </section>
    )
}

export default function ProductTable({
    products,
}: ProductTableProps) {
    if (products.length === 0) {
        return <EmptyProducts />
    }
    return (
        <section className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#111111]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-212.5 text-left">
                    <thead className="border-b border-white/[0.07] bg-white/2">
                        <tr>
                            <th 
                            scope="col"
                            className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                                Product
                            </th>

                            <th                             
                            scope="col"
                            className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                                Category
                            </th>

                            <th                             
                            scope="col"
                            className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                                Status
                            </th>

                            <th                             
                            scope="col"
                            className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
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

                            const productImage = getProductImage(
                                product.product_images,
                            );

                            return (
                                <tr
                                    key={product.id}
                                    className="transition hover:bg-zinc-900"
                                >
                                    <td className="px-6 py-5">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="group flex items-center gap-4"
                                        >
                                            {productImage && (
                                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg 
                                                border border-zinc-800 bg-zinc-950">
                                                    <Image
                                                        src={getProductImageUrl(productImage.storage_path)}
                                                        alt={productImage.alt_text ?? product.title}
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover transition group-hover:scale-105"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-medium text-white transition group-hover:text-zinc-300">
                                                    {product.title}
                                                </p>

                                                <p className="mt-1 text-sm text-zinc-500">
                                                    /{product.slug}
                                                </p>
                                            </div>
                                        </Link>
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

                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-4">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="text-sm font-medium text-zinc-400 transition hover:text-white"
                                            >
                                                Edit
                                            </Link>

                                            <DeleteProductButton
                                                productId={product.id}
                                                productTitle={product.title}
                                            />
                                        </div>
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
