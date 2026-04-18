import { useEffect, useState } from "react";
import axios from "axios";
import {
  deactivateDocumentAccessLevel,
  getDocumentAccessLevels,
  reactivateDocumentAccessLevel,
  updateDocumentAccessLevel,
} from "../services/documentAccessLevelService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { validateDocumentAccessLevel } from "../validators/documentAccessLevelValidators";

import {
  buildUpdateDocumentAccessLevelPayload,
  getInitialDocumentAccessLevelForm,
  mapDocumentAccessLevelToForm,
} from "../mappers/documentAccessLevelMappers";
import { t } from "../i18n";

/**
 * Encapsulates all DocumentAccessLevelsPage state and handlers.
 */
export function useDocumentAccessLevelsPage() {
  const [editForm, setEditForm] = useState(getInitialDocumentAccessLevelForm());
  const [documentAccessLevels, setDocumentAccessLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [showEditForm, setShowEditForm] = useState(false);

  const [updatingDocumentAccessLevel, setUpdatingDocumentAccessLevel] =
    useState(false);

  const [
    deactivatingDocumentAccessLevelId,
    setDeactivatingDocumentAccessLevelId,
  ] = useState(null);

  const [
    reactivatingDocumentAccessLevelId,
    setReactivatingDocumentAccessLevelId,
  ] = useState(null);

  const [editingDocumentAccessLevelId, setEditingDocumentAccessLevelId] =
    useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    async function loadDocumentAccessLevels() {
      try {
        const data = await getDocumentAccessLevels();

        const normalized = Array.isArray(data)
          ? data
          : data.documentAccessLevels || data.items || [];

        setDocumentAccessLevels(normalized);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            getApiErrorMessage(
              err,
              t("documentAccessLevels.messages.loadError"),
            ),
          );
        } else {
          setError(t("documentAccessLevels.messages.unexpected"));
        }
      } finally {
        setLoading(false);
      }
    }

    loadDocumentAccessLevels();
  }, []);

  function updateInState(updated) {
    setDocumentAccessLevels((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
  }

  function deactivateInState(id) {
    setDocumentAccessLevels((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: false } : item,
      ),
    );
  }

  function reactivateInState(id) {
    setDocumentAccessLevels((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: true } : item)),
    );
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleOpenEditForm(item) {
    setActionMessage("");
    setEditingDocumentAccessLevelId(item.id);

    setEditForm(mapDocumentAccessLevelToForm(item));

    setShowEditForm(true);
  }

  function resetEditForm() {
    setEditForm(getInitialDocumentAccessLevelForm());
    setEditingDocumentAccessLevelId(null);
    setShowEditForm(false);
  }

  async function handleUpdateDocumentAccessLevel(e) {
    e.preventDefault();

    if (!editingDocumentAccessLevelId) return;

    setUpdatingDocumentAccessLevel(true);
    setActionMessage("");

    try {
      const validationError = validateDocumentAccessLevel(editForm, t);

      if (validationError) {
        setActionMessage(validationError);
        return;
      }

      const payload = buildUpdateDocumentAccessLevelPayload(editForm);

      const updated = await updateDocumentAccessLevel(
        editingDocumentAccessLevelId,
        payload,
      );

      if (updated?.id) updateInState(updated);

      setActionMessage(t("documentAccessLevels.messages.updated"));
      resetEditForm();
    } catch (err) {
      setActionMessage(
        axios.isAxiosError(err)
          ? getApiErrorMessage(
              err,
              t("documentAccessLevels.messages.updateError"),
            )
          : t("documentAccessLevels.messages.unexpected"),
      );
    } finally {
      setUpdatingDocumentAccessLevel(false);
    }
  }

  async function handleDeactivateDocumentAccessLevel(id) {
    setActionMessage("");
    setDeactivatingDocumentAccessLevelId(id);

    try {
      await deactivateDocumentAccessLevel(id);
      deactivateInState(id);
      setActionMessage(t("documentAccessLevels.messages.deactivated"));
    } catch (err) {
      setActionMessage(
        axios.isAxiosError(err)
          ? getApiErrorMessage(
              err,
              t("documentAccessLevels.messages.deactivateError"),
            )
          : t("documentAccessLevels.messages.unexpected"),
      );
    } finally {
      setDeactivatingDocumentAccessLevelId(null);
    }
  }

  async function handleReactivateDocumentAccessLevel(id) {
    setActionMessage("");
    setReactivatingDocumentAccessLevelId(id);

    try {
      await reactivateDocumentAccessLevel(id);
      reactivateInState(id);
      setActionMessage(t("documentAccessLevels.messages.reactivated"));
    } catch (err) {
      setActionMessage(
        axios.isAxiosError(err)
          ? getApiErrorMessage(
              err,
              t("documentAccessLevels.messages.reactivateError"),
            )
          : t("documentAccessLevels.messages.unexpected"),
      );
    } finally {
      setReactivatingDocumentAccessLevelId(null);
    }
  }

  return {
    actionMessage,
    documentAccessLevels,
    editForm,
    error,
    handleDeactivateDocumentAccessLevel,
    handleEditFormChange,
    handleOpenEditForm,
    handleReactivateDocumentAccessLevel,
    handleUpdateDocumentAccessLevel,
    loading,
    resetEditForm,
    showEditForm,
    updatingDocumentAccessLevel,
    deactivatingDocumentAccessLevelId,
    reactivatingDocumentAccessLevelId,
  };
}
