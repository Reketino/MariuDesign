type ProductValidationValues = {
  title: string;
  slug: string;
  categoryId: string;
  status: string;
  license: string;
};

export function validateProduct(
    values: ProductValidationValues,
): string | null {
    if (!values.title.trim()) {
        return "Product title is required.";
    }
}