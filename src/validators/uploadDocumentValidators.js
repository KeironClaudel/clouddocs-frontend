/**
 * Validates the selected file.
 */
export function validateFile(file, maxSize, t) {
  if (!file) {
    return t("uploadDocument.messages.selectFile");
  }

  if (file.type !== "application/pdf") {
    return t("uploadDocument.messages.onlyPdf");
  }

  if (file.size > maxSize) {
    return t("uploadDocument.messages.fileTooLarge");
  }

  return null;
}

/**
 * Validates the upload document form.
 */
export function validateUploadDocumentForm({
  selectedFile,
  form,
  isDepartmentOnly,
  t,
}) {
  if (!selectedFile) {
    return t("uploadDocument.messages.selectFile");
  }

  if (!form.categoryId) {
    return t("uploadDocument.messages.selectCategory");
  }

  if (!form.clientId) {
    return t("uploadDocument.messages.selectClient");
  }

  if (!form.documentTypeId) {
    return t("uploadDocument.messages.selectType");
  }

  if (!form.accessLevelId) {
    return t("uploadDocument.messages.selectAccess");
  }

  if (!form.expirationDatePendingDefinition && !form.expirationDate) {
    return t("uploadDocument.messages.expirationRequired");
  }

  if (isDepartmentOnly && form.departmentIds.length === 0) {
    return t("uploadDocument.messages.selectDepartments");
  }

  return null;
}
