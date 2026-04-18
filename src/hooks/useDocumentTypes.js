import { useEffect, useState } from "react";
import {
  createDocumentType,
  deactivateDocumentType,
  getDocumentTypes,
  reactivateDocumentType,
  updateDocumentType,
} from "../services/documentTypeService";
import { resolveApiErrorMessage } from "../utils/apiErrorHandler";
import {
  validateCreateDocumentType,
  validateUpdateDocumentType,
} from "../validators/documentTypeValidators";

import {
  buildCreateDocumentTypePayload,
  buildUpdateDocumentTypePayload,
  getInitialCreateDocumentTypeForm,
  getInitialEditDocumentTypeForm,
  mapDocumentTypeToEditForm,
} from "../mappers/documentTypeMappers";
import { t } from "../i18n";

/**
 * Encapsulates all DocumentTypesPage state and handlers.
 */
export function useDocumentTypesPage() {
  const [createForm, setCreateForm] = useState(
    getInitialCreateDocumentTypeForm(),
  );

  const [editForm, setEditForm] = useState(getInitialEditDocumentTypeForm());

  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [creatingDocumentType, setCreatingDocumentType] = useState(false);
  const [updatingDocumentType, setUpdatingDocumentType] = useState(false);

  const [deactivatingDocumentTypeId, setDeactivatingDocumentTypeId] =
    useState(null);
  const [reactivatingDocumentTypeId, setReactivatingDocumentTypeId] =
    useState(null);

  const [editingDocumentTypeId, setEditingDocumentTypeId] = useState(null);

  useEffect(() => {
    async function loadDocumentTypes() {
      try {
        const data = await getDocumentTypes();

        const normalizedDocumentTypes = Array.isArray(data)
          ? data
          : data.documentTypes || data.items || [];

        setDocumentTypes(normalizedDocumentTypes);
      } catch (err) {
        setError(
          resolveApiErrorMessage(err, t("documentTypes.messages.loadError")),
        );
      } finally {
        setLoading(false);
      }
    }

    loadDocumentTypes();
  }, []);

  function handleCreateFormChange(event) {
    const { name, value } = event.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEditFormChange(event) {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetCreateForm() {
    setCreateForm(getInitialCreateDocumentTypeForm());
    setShowCreateForm(false);
  }

  function resetEditForm() {
    setEditForm(getInitialEditDocumentTypeForm());
    setEditingDocumentTypeId(null);
    setShowEditForm(false);
  }

  function addDocumentTypeToState(documentType) {
    setDocumentTypes((prev) => [documentType, ...prev]);
  }

  function updateDocumentTypeInState(updatedDocumentType) {
    setDocumentTypes((prev) =>
      prev.map((documentType) =>
        documentType.id === updatedDocumentType.id
          ? updatedDocumentType
          : documentType,
      ),
    );
  }

  function deactivateDocumentTypeInState(documentTypeId) {
    setDocumentTypes((prev) =>
      prev.map((documentType) =>
        documentType.id === documentTypeId
          ? { ...documentType, isActive: false }
          : documentType,
      ),
    );
  }

  function reactivateDocumentTypeInState(documentTypeId) {
    setDocumentTypes((prev) =>
      prev.map((documentType) =>
        documentType.id === documentTypeId
          ? { ...documentType, isActive: true }
          : documentType,
      ),
    );
  }

  async function handleCreateDocumentType(event) {
    event.preventDefault();

    const validationError = validateCreateDocumentType(createForm, t);

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setActionMessage("");
    setCreatingDocumentType(true);

    try {
      const payload = buildCreateDocumentTypePayload(createForm);

      const createdDocumentType = await createDocumentType(payload);

      if (createdDocumentType?.id) {
        addDocumentTypeToState(createdDocumentType);
      }

      setActionMessage(t("documentTypes.messages.created"));
      resetCreateForm();
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("documentTypes.messages.createError")),
      );
    } finally {
      setCreatingDocumentType(false);
    }
  }

  function handleOpenEditForm(documentType) {
    setActionMessage("");
    setEditingDocumentTypeId(documentType.id);

    setEditForm(mapDocumentTypeToEditForm(documentType));

    setShowEditForm(true);
  }

  async function handleUpdateDocumentType(event) {
    event.preventDefault();

    if (!editingDocumentTypeId) return;

    const validationError = validateUpdateDocumentType(editForm, t);

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setActionMessage("");
    setUpdatingDocumentType(true);

    try {
      const payload = buildUpdateDocumentTypePayload(editForm);

      const updatedDocumentType = await updateDocumentType(
        editingDocumentTypeId,
        payload,
      );

      if (updatedDocumentType?.id) {
        updateDocumentTypeInState(updatedDocumentType);
      }

      setActionMessage(t("documentTypes.messages.updated"));
      resetEditForm();
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("documentTypes.messages.updateError")),
      );
    } finally {
      setUpdatingDocumentType(false);
    }
  }

  async function handleDeactivateDocumentType(documentTypeId) {
    setActionMessage("");
    setDeactivatingDocumentTypeId(documentTypeId);

    try {
      await deactivateDocumentType(documentTypeId);
      deactivateDocumentTypeInState(documentTypeId);
      setActionMessage(t("documentTypes.messages.deactivated"));
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(
          err,
          t("documentTypes.messages.deactivateError"),
        ),
      );
    } finally {
      setDeactivatingDocumentTypeId(null);
    }
  }

  async function handleReactivateDocumentType(documentTypeId) {
    setActionMessage("");
    setReactivatingDocumentTypeId(documentTypeId);

    try {
      await reactivateDocumentType(documentTypeId);
      reactivateDocumentTypeInState(documentTypeId);
      setActionMessage(t("documentTypes.messages.reactivated"));
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(
          err,
          t("documentTypes.messages.reactivateError"),
        ),
      );
    } finally {
      setReactivatingDocumentTypeId(null);
    }
  }

  return {
    actionMessage,
    createForm,
    creatingDocumentType,
    deactivatingDocumentTypeId,
    documentTypes,
    editForm,
    error,
    handleCreateDocumentType,
    handleCreateFormChange,
    handleDeactivateDocumentType,
    handleEditFormChange,
    handleOpenEditForm,
    handleReactivateDocumentType,
    handleUpdateDocumentType,
    loading,
    reactivatingDocumentTypeId,
    resetCreateForm,
    resetEditForm,
    setShowCreateForm,
    showCreateForm,
    showEditForm,
    updatingDocumentType,
  };
}
