export type ProductCategory = {
    id: string;
    name: string;
    slug: string;
};

export type Product = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: string;
    license: string | null;
    created_at: string;
    category_id: string | null;
    categories: ProductCategory[] | null;
};