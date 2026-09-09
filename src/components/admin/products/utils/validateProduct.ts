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

       if (!values.slug.trim()) {
        return "Product slug is required.";
    }

       if (!values.title.trim()) {
        return "Product category is required.";
    }

       if (!values.title.trim()) {
        return "Product status is required.";
    }

       if (!values.title.trim()) {
        return "Product license is required.";
    }
}