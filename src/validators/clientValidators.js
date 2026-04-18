function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateCreateClient(form, t) {
  if (!form.name.trim()) {
    return t("clients.messages.nameRequired");
  }

  if (form.email && !isValidEmail(form.email)) {
    return t("clients.messages.invalidEmail");
  }

  return null;
}

export function validateUpdateClient(form, t) {
  if (!form.name.trim()) {
    return t("clients.messages.nameRequired");
  }

  if (form.email && !isValidEmail(form.email)) {
    return t("clients.messages.invalidEmail");
  }

  return null;
}
