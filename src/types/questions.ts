export type ProductQuestion = {
    id: string;
    product_id: string | null;
    title: string;
    content: string;
    is_hidden: boolean;
    created_at: string;
    updated_at: string;
}