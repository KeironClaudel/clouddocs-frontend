/**
 * Validates document access level update form.
 */
export function validateDocumentAccessLevel(form, t) {
  if (!form.name.trim()) {
    return t("documentAccessLevels.messages.nameRequired");
  }

  return null;
}
