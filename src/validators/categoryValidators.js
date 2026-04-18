/**
 * Validates category create form.
 */
export function validateCreateCategory(form, t) {
  if (!form.name.trim()) {
    return t("categories.messages.nameRequired");
  }

  return null;
}

/**
 * Validates category update form.
 */
export function validateUpdateCategory(form, t) {
  if (!form.name.trim()) {
    return t("categories.messages.nameRequired");
  }

  return null;
}
