export function getInitialClientForm() {
  return {
    name: "",
    legalName: "",
    identification: "",
    email: "",
    phone: "",
    notes: "",
  };
}

export function buildClientPayload(form) {
  return {
    name: form.name.trim(),
    legalName: form.legalName.trim() || null,
    identification: form.identification.trim() || null,
    email: form.email.trim() || null,
    phone: form.phone.trim() || null,
    notes: form.notes.trim() || null,
  };
}

export function mapClientToForm(client) {
  return {
    name: client.name || "",
    legalName: client.legalName || "",
    identification: client.identification || "",
    email: client.email || "",
    phone: client.phone || "",
    notes: client.notes || "",
  };
}
