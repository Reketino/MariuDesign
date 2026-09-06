import type { ProductFormData } from "@/types/products";

type ProductFormValues = Pick<
    ProductFormData,
    "title" |
    "slug" |
    "description" |
    "category_id" |
    "status" |
    "license"
>;

type SaveProductParams = {
    supabase: ReturnType<
        typeof import("@/lib/supabase/client").createClient
    >;
    values: ProductFormValues;
    productId?: string;
};

export async function saveProduct({
    supabase,
    values,
    productId,
}: SaveProductParams): Promise<string> {
    const productData = {
        title: values.title,
        slug: values.slug,
        description: values.description || null,
        category_id: values.category_id || null,
        status: values.status,
        license: values.license || null,
    };

    if (productId) {
        const { error } = await supabase
            .from("products")
            .update(productData)
            .eq("id", productId);

        if (error) {
            throw new Error(error.message);
        }

        return productId;
    }

    const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select("id")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data.id;
}