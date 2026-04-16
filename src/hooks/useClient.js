import { useEffect, useState } from "react";
import axios from "axios";
import {
  createClient,
  deactivateClient,
  getClients,
  reactivateClient,
  updateClient,
} from "../services/clientService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";

/**
 * Encapsulates all ClientsPage state and handlers.
 */
export function useClientsPage() {
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

  const initialForm = {
    name: "",
    legalName: "",
    identification: "",
    email: "",
    phone: "",
    notes: "",
  };

  const [createForm, setCreateForm] = useState(initialForm);
  const [editForm, setEditForm] = useState(initialForm);

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients();

        const normalized = Array.isArray(data)
          ? data
          : data.clients || data.items || [];

        setClients(normalized);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(getApiErrorMessage(err, t("clients.messages.loadError")));
        } else {
          setError(t("clients.messages.unexpected"));
        }
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
    setCreateForm(initialForm);
    setShowCreateForm(false);
  }

  function resetEditForm() {
    setEditForm(initialForm);
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
    setCreatingClient(true);

    try {
      const payload = {
        name: createForm.name.trim(),
        legalName: createForm.legalName.trim() || null,
        identification: createForm.identification.trim() || null,
        email: createForm.email.trim() || null,
        phone: createForm.phone.trim() || null,
        notes: createForm.notes.trim() || null,
      };

      const createdClient = await createClient(payload);

      if (createdClient?.id) {
        addClientToState(createdClient);
      }

      if (!createForm.name.trim()) {
        setActionMessage(t("clients.messages.nameRequired"));
        return;
      }

      setActionMessage(t("clients.messages.created"));
      resetCreateForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("clients.messages.createError")),
        );
      } else {
        setActionMessage(t("clients.messages.unexpected"));
      }
    } finally {
      setCreatingClient(false);
    }
  }

  function handleOpenEditForm(client) {
    setActionMessage("");
    setEditingClientId(client.id);

    setEditForm({
      name: client.name || "",
      legalName: client.legalName || "",
      identification: client.identification || "",
      email: client.email || "",
      phone: client.phone || "",
      notes: client.notes || "",
    });

    setShowEditForm(true);
  }

  async function handleUpdateClient(event) {
    event.preventDefault();

    if (!editingClientId) {
      return;
    }

    setActionMessage("");
    setUpdatingClient(true);

    try {
      const payload = {
        name: editForm.name.trim(),
        legalName: editForm.legalName.trim() || null,
        identification: editForm.identification.trim() || null,
        email: editForm.email.trim() || null,
        phone: editForm.phone.trim() || null,
        notes: editForm.notes.trim() || null,
      };

      const updatedClient = await updateClient(editingClientId, payload);

      if (updatedClient?.id) {
        updateClientInState(updatedClient);
      }

      if (!editForm.name.trim()) {
        setActionMessage(t("clients.messages.nameRequired"));
        return;
      }

      setActionMessage(t("clients.messages.updated"));
      resetEditForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("clients.messages.updateError")),
        );
      } else {
        setActionMessage(t("clients.messages.unexpected"));
      }
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
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("clients.messages.deactivateError")),
        );
      } else {
        setActionMessage(t("clients.messages.unexpected"));
      }
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
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("clients.messages.reactivateError")),
        );
      } else {
        setActionMessage(t("clients.messages.unexpected"));
      }
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
