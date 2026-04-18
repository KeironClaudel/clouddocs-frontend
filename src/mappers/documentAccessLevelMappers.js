/**
 * Returns initial edit form state.
 */
export function getInitialDocumentAccessLevelForm() {
  return {
    name: "",
    description: "",
  };
}

/**
 * Maps API item to edit form.
 */
export function mapDocumentAccessLevelToForm(item) {
  return {
    name: item.name || "",
    description: item.description || "",
  };
}

/**
 * Builds payload for updating document access level.
 */
export function buildUpdateDocumentAccessLevelPayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
  };
}
