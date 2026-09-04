export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ProductImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
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
  product_images: ProductImage[] | null;
};

export type ProductFormData = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  license: string | null;
  category_id: string | null;
  product_images: ProductImage[] | null;
};
