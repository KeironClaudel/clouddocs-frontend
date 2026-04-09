import { useEffect, useState } from "react";
import axios from "axios";
import {
  createDocumentType,
  deactivateDocumentType,
  getDocumentTypes,
  reactivateDocumentType,
  updateDocumentType,
} from "../services/documentTypeService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";

/**
 * Encapsulates all DocumentTypesPage state and handlers.
 */
export function useDocumentTypesPage() {
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

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    async function loadDocumentTypes() {
      try {
        const data = await getDocumentTypes();

        const normalizedDocumentTypes = Array.isArray(data)
          ? data
          : data.documentTypes || data.items || [];

        setDocumentTypes(normalizedDocumentTypes);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            getApiErrorMessage(err, t("documentTypes.messages.loadError")),
          );
        } else {
          setError(t("documentTypes.messages.unexpected"));
        }
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
    setCreateForm({
      name: "",
      description: "",
    });
    setShowCreateForm(false);
  }

  function resetEditForm() {
    setEditForm({
      name: "",
      description: "",
    });
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

    setActionMessage("");
    setCreatingDocumentType(true);

    try {
      const payload = {
        name: createForm.name,
        description: createForm.description || null,
      };

      const createdDocumentType = await createDocumentType(payload);

      if (createdDocumentType?.id) {
        addDocumentTypeToState(createdDocumentType);
      }

      setActionMessage(t("documentTypes.messages.created"));
      resetCreateForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("documentTypes.messages.createError")),
        );
      } else {
        setActionMessage(t("documentTypes.messages.unexpected"));
      }
    } finally {
      setCreatingDocumentType(false);
    }
  }

  function handleOpenEditForm(documentType) {
    setActionMessage("");
    setEditingDocumentTypeId(documentType.id);
    setEditForm({
      name: documentType.name || "",
      description: documentType.description || "",
    });
    setShowEditForm(true);
  }

  async function handleUpdateDocumentType(event) {
    event.preventDefault();

    if (!editingDocumentTypeId) {
      return;
    }

    setActionMessage("");
    setUpdatingDocumentType(true);

    try {
      const payload = {
        name: editForm.name,
        description: editForm.description || null,
      };

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
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("documentTypes.messages.updateError")),
        );
      } else {
        setActionMessage(t("documentTypes.messages.unexpected"));
      }
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
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("documentTypes.messages.deactivateError")),
        );
      } else {
        setActionMessage(t("documentTypes.messages.unexpected"));
      }
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
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("documentTypes.messages.reactivateError")),
        );
      } else {
        setActionMessage(t("documentTypes.messages.unexpected"));
      }
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
