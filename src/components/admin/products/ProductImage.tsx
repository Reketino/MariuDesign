"use client";

type ProductImagesProps = {
    image: File | null;
    error: string;
    onImageChange: (
        event: React.ChangeEvent<HTMLInputElement>,
    
    ) => void;
};

export default function ProductImages({
    image,
    error,
    onImageChange,
}: ProductImagesProps) {
     <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
            <header>
                <h2 className="text-lg font-semibold text-white">
                    Product images
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Upload the main image for this 3D model.
                </p>
            </header>

            <div className="mt-6">
                <label
                    htmlFor="product-image"
                    className="block text-sm font-medium text-zinc-300"
                >
                    Image
                </label>

                <input
                    id="product-image"
                    name="product-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onImageChange}
                    className="mt-2 block w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700"
                />

                <p className="mt-2 text-xs text-zinc-600">
                    JPG, PNG or WebP. Maximum 5 MB.
                </p>

                {image && (
                    <p className="mt-3 text-sm text-zinc-400">
                        Selected:{" "}

                        <span className="text-white">
                            {image.name}
                        </span>
                    </p>
                )}

                {error && (
                    <p
                        role="alert"
                        className="mt-3 text-sm text-red-400"
                    >
                        {error}
                    </p>
                )}
                </div>
                </section>
}