import React from "react";
import ClientAutocomplete from "./ClientAutocomplete";

const allClients = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Globex" },
  { id: "3", name: "Initech" },
];

export default {
  title: "Components/ClientAutocomplete",
  component: ClientAutocomplete,
};

/**
 * @typedef {Object} ClientAutocompleteProps
 * @property {string} searchTerm - Texto actual de búsqueda
 * @property {Function} setSearchTerm - Callback cuando cambia el texto
 * @property {Array<Object>} options - Opciones de cliente
 * @property {Function} onSelectClient - Callback cuando se selecciona un cliente
 */

export const Default = () => {
  const [searchTerm, setSearchTerm] = React.useState("Ac");
  const [selectedClientId, setSelectedClientId] = React.useState("");

  const options = allClients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div style={{ padding: "20px", width: "400px" }}>
      <ClientAutocomplete
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        options={options}
        selectedClientId={selectedClientId}
        onSelectClient={(client) => {
          setSelectedClientId(client.id);
          setSearchTerm(client.name);
        }}
        placeholder="Selecciona un cliente..."
      />
      <p style={{ marginTop: "10px" }}>
        Cliente actual:{" "}
        {allClients.find((client) => client.id === selectedClientId)?.name ||
          "Ninguno"}
      </p>
    </div>
  );
};

export const Loading = () => (
  <div style={{ padding: "20px", width: "400px" }}>
    <ClientAutocomplete
      searchTerm="Ac"
      setSearchTerm={() => {}}
      options={[]}
      loading={true}
      placeholder="Selecciona un cliente..."
      loadingText="Buscando clientes..."
    />
  </div>
);

Default.storyName = "ClientAutocomplete";
Default.parameters = {
  docs: {
    description: {
      component: `
# ClientAutocomplete Component

Campo de autocompletación para seleccionar clientes con búsqueda en tiempo real.

## Propiedades

- **searchTerm**: Texto actual de búsqueda
- **setSearchTerm**: Callback para actualizar el texto
- **options**: Lista de clientes sugeridos
- **selectedClientId**: Cliente activo en el formulario
- **onSelectClient**: Callback ejecutado al seleccionar un cliente
- **placeholder**: Texto de ayuda

## Características

- Búsqueda en tiempo real
- Desplegable con resultados
- Estado de carga
- Cierre al hacer click fuera
- Estilos con Tailwind CSS

## Ejemplo de uso

\`\`\`jsx
const [searchTerm, setSearchTerm] = React.useState('');
const [selectedClientId, setSelectedClientId] = React.useState('');

<ClientAutocomplete
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  options={clientOptions}
  selectedClientId={selectedClientId}
  onSelectClient={(client) => {
    setSelectedClientId(client.id);
    setSearchTerm(client.name);
  }}
  placeholder="Buscar cliente..."
/>
\`\`\`
      `,
    },
  },
};
