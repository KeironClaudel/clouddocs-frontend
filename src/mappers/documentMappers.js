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

/*
 * Returns initial state for document filters.
 */
export function getInitialDocumentFilters() {
  return {
    searchTerm: "",
    categoryId: "",
    month: "",
    year: "",
    documentType: "",
    expirationPending: "",
    isActive: "",
    clientId: "",
  };
}

/**
 * Returns initial state for document list UI.
 */
export function getInitialSendToClientForm() {
  return {
    subject: "",
    message: "",
  };
}

/**
 * Returns the initial visibility form state.
 */
export function getInitialVisibilityForm() {
  return {
    accessLevelId: "",
    departmentIds: [],
  };
}
