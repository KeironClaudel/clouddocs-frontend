export function getInitialCategoryForm() {
  return {
    name: "",
    description: "",
  };
}

export function buildCategoryPayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
  };
}

export function mapCategoryToForm(category) {
  return {
    name: category.name || "",
    description: category.description || "",
  };
}
