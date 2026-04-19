/**
 * Builds a display label for a client.
 * Uses backend DisplayName if available, otherwise falls back to Name + Identification.
 */
export function getClientLabel(client) {
  if (!client) return "";

  if (client.displayName) return client.displayName;

  if (client.identification) {
    return `${client.name} - ${client.identification}`;
  }

  return client.name;
}
