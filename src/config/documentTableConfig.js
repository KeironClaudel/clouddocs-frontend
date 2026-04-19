export function getDocumentTableColumns(t) {
  return [
    { key: "name", label: t("documents.table.name") },
    { key: "client", label: t("documents.table.client") },
    { key: "category", label: t("documents.table.category") },
    { key: "uploadedBy", label: t("documents.table.uploadedBy") },
    { key: "department", label: t("documents.table.department") },
    { key: "documentType", label: t("documents.table.type") },
    { key: "created", label: t("documents.table.created") },
    { key: "status", label: t("documents.table.status") },
    { key: "version", label: t("documents.table.version") },
    { key: "actions", label: t("documents.table.actions") },
  ];
}
