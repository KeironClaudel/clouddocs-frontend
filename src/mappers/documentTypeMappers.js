/**
 * Returns initial create form state.
 */
export function getInitialCreateDocumentTypeForm() {
  return {
    name: "",
    description: "",
  };
}

/**
 * Returns initial edit form state.
 */
export function getInitialEditDocumentTypeForm() {
  return {
    name: "",
    description: "",
  };
}

/**
 * Builds payload for creating a document type.
 */
export function buildCreateDocumentTypePayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
  };
}

/**
 * Builds payload for updating a document type.
 */
export function buildUpdateDocumentTypePayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
  };
}

/**
 * Maps API data to edit form.
 */
export function mapDocumentTypeToEditForm(documentType) {
  return {
    name: documentType.name || "",
    description: documentType.description || "",
  };
}
