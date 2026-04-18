import { useEffect, useState } from "react";
import {
  createClient,
  deactivateClient,
  getClients,
  reactivateClient,
  updateClient,
} from "../services/clientService";
import { resolveApiErrorMessage } from "../utils/apiErrorHandler";
import {
  validateCreateClient,
  validateUpdateClient,
} from "../validators/clientValidators";

import {
  buildClientPayload,
  getInitialClientForm,
  mapClientToForm,
} from "../mappers/clientMappers";
import { t } from "../i18n";

/**
 * Encapsulates all ClientsPage state and handlers.
 */
export function useClientsPage() {
  const [createForm, setCreateForm] = useState(getInitialClientForm());
  const [editForm, setEditForm] = useState(getInitialClientForm());
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [creatingClient, setCreatingClient] = useState(false);
  const [updatingClient, setUpdatingClient] = useState(false);

  const [deactivatingClientId, setDeactivatingClientId] = useState(null);
  const [reactivatingClientId, setReactivatingClientId] = useState(null);

  const [editingClientId, setEditingClientId] = useState(null);

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients();

        const normalized = Array.isArray(data)
          ? data
          : data.clients || data.items || [];

        setClients(normalized);
      } catch (err) {
        setActionMessage(
          resolveApiErrorMessage(err, t("clients.messages.loadError")),
        );
      } finally {
        setLoading(false);
      }
    }

    loadClients();
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
    setCreateForm(getInitialClientForm());
    setShowCreateForm(false);
  }

  function resetEditForm() {
    setEditForm(getInitialClientForm());
    setEditingClientId(null);
    setShowEditForm(false);
  }

  function addClientToState(client) {
    setClients((prev) => [client, ...prev]);
  }

  function updateClientInState(updatedClient) {
    setClients((prev) =>
      prev.map((client) =>
        client.id === updatedClient.id ? updatedClient : client,
      ),
    );
  }

  function deactivateClientInState(clientId) {
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId ? { ...client, isActive: false } : client,
      ),
    );
  }

  function reactivateClientInState(clientId) {
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId ? { ...client, isActive: true } : client,
      ),
    );
  }

  async function handleCreateClient(event) {
    event.preventDefault();

    setActionMessage("");

    const validationError = validateCreateClient(createForm, t);

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setCreatingClient(true);

    try {
      const payload = buildClientPayload(createForm);

      const createdClient = await createClient(payload);

      if (createdClient?.id) {
        addClientToState(createdClient);
      }

      setActionMessage(t("clients.messages.created"));
      resetCreateForm();
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("clients.messages.createError")),
      );
    } finally {
      setCreatingClient(false);
    }
  }

  function handleOpenEditForm(client) {
    setActionMessage("");
    setEditingClientId(client.id);

    setEditForm(mapClientToForm(client));

    setShowEditForm(true);
  }

  async function handleUpdateClient(event) {
    event.preventDefault();

    if (!editingClientId) {
      return;
    }

    setActionMessage("");

    const validationError = validateUpdateClient(editForm, t);

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setUpdatingClient(true);
    try {
      const payload = buildClientPayload(editForm);

      const updatedClient = await updateClient(editingClientId, payload);

      if (updatedClient?.id) {
        updateClientInState(updatedClient);
      }

      setActionMessage(t("clients.messages.updated"));
      resetEditForm();
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("clients.messages.updateError")),
      );
    } finally {
      setUpdatingClient(false);
    }
  }

  async function handleDeactivateClient(clientId) {
    setActionMessage("");
    setDeactivatingClientId(clientId);

    try {
      await deactivateClient(clientId);
      deactivateClientInState(clientId);
      setActionMessage(t("clients.messages.deactivated"));
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("clients.messages.deactivateError")),
      );
    } finally {
      setDeactivatingClientId(null);
    }
  }

  async function handleReactivateClient(clientId) {
    setActionMessage("");
    setReactivatingClientId(clientId);

    try {
      await reactivateClient(clientId);
      reactivateClientInState(clientId);
      setActionMessage(t("clients.messages.reactivated"));
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("clients.messages.reactivateError")),
      );
    } finally {
      setReactivatingClientId(null);
    }
  }

  return {
    actionMessage,
    clients,
    createForm,
    creatingClient,
    deactivatingClientId,
    editForm,
    error,
    handleCreateClient,
    handleCreateFormChange,
    handleDeactivateClient,
    handleEditFormChange,
    handleOpenEditForm,
    handleReactivateClient,
    handleUpdateClient,
    loading,
    reactivatingClientId,
    resetCreateForm,
    resetEditForm,
    setShowCreateForm,
    showCreateForm,
    showEditForm,
    updatingClient,
  };
}
