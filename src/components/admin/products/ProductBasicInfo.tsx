"use client";

type ProductBasicInfoProps = {
    title: string;
    slug: string;
    description: string;
    onTitleChange: (value: string) => void;
    onSlugChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
};

export default function ProductBasicInfo({
    title,
    slug,
    description,
    onTitleChange,
    onSlugChange,
    onDescriptionChange,
}: ProductBasicInfoProps) {
   return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
            <header>
                <h2 className="text-lg font-semibold text-white">
                    Product information
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Add the basic information for your 3D model here.
                </p>
            </header>

            <div className="mt-6 space-y-6">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-zinc-300"
                    >
                        Title
                    </label>

                    <input
                        id="title"
                        name="title"
                        value={title}
                        onChange={(event) =>
                            onTitleChange(event.target.value)
                        }
                        placeholder="Example: Sorting Bucket"
                        required
                        className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="slug"
                        className="block text-sm font-medium text-zinc-300"
                    >
                        Slug
                    </label>

                    <input
                        id="slug"
                        name="slug"
                        type="text"
                        value={slug}
                        onChange={(event) =>
                            onSlugChange(event.target.value)
                        }
                        placeholder="sorting-bucket"
                        className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                    />

                    <p className="mt-2 text-xs text-zinc-600">
                        Used in the product URL.
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-zinc-300"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(event) =>
                            onDescriptionChange(event.target.value)
                        }
                        rows={6}
                        placeholder="Describe the model, compatible machinery, intended use, printing recommendations, and included parts."
                        className="mt-2 block w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                    />
                </div>
            </div>
        </section>
   );
}