type ProductValidationValues = {
  title: string;
  slug: string;
  categoryId: string;
  status: string;
  license: string;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateProduct(
  values: ProductValidationValues,
): string | null {
  if (!values.title.trim()) {
    return "Product title is required.";
  }

  if (!values.slug.trim()) {
    return "Product slug is required.";
  }

  if (values.slug !== values.slug.toLowerCase()) {
    return "Product slug must use lowercase letters.";
  }

  if (!SLUG_PATTERN.test(values.slug)) {
    return "Product slug must use lowercase letters.";
  }

  if (!values.categoryId) {
    return "Product category is required.";
  }

  if (!values.status) {
    return "Product status is required.";
  }

  if (!values.license.trim()) {
    return "Product license is required.";
  }

  return null;
}
