/**
 * Returns initial form state.
 */
export function getInitialUploadForm() {
  return {
    categoryId: "",
    documentTypeId: "",
    expirationDate: "",
    expirationDatePendingDefinition: false,
    accessLevelId: "",
    departmentIds: [],
    clientId: "",
  };
}

/**
 * Builds payload for upload API.
 */
export function buildUploadDocumentPayload({ file, form, isDepartmentOnly }) {
  return {
    file,
    categoryId: form.categoryId,
    documentTypeId: form.documentTypeId,
    expirationDate: form.expirationDate || null,
    expirationDatePendingDefinition: form.expirationDatePendingDefinition,
    accessLevelId: form.accessLevelId,
    departmentIds: isDepartmentOnly ? form.departmentIds : [],
    clientId: form.clientId,
  };
}

/**
 * Returns the initial client search UI state for upload document.
 */
export function getInitialUploadClientSearchState() {
  return {
    clientSearchTerm: "",
    clientOptions: [],
    hasSearchedClients: false,
  };
}
