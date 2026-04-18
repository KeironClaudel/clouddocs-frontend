/**
 * Builds payload for updating document visibility.
 */
export function buildVisibilityPayload({ visibilityForm, isDepartmentOnly }) {
  return {
    accessLevelId: visibilityForm.accessLevelId,
    departmentIds: isDepartmentOnly ? visibilityForm.departmentIds : [],
  };
}

/**
 * Builds payload for sending document to client.
 */
export function buildSendToClientPayload(form) {
  return {
    subject: form.subject.trim() || null,
    message: form.message.trim() || null,
  };
}
