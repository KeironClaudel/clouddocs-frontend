/**
 * Validates document type create form.
 */
export function validateCreateDocumentType(form, t) {
  if (!form.name.trim()) {
    return t("documentTypes.messages.nameRequired");
  }

  return null;
}

/**
 * Validates document type update form.
 */
export function validateUpdateDocumentType(form, t) {
  if (!form.name.trim()) {
    return t("documentTypes.messages.nameRequired");
  }

  return null;
}
