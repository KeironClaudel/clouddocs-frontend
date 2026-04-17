import React from "react";
import ClientAutocomplete from "../src/components/ClientAutocomplete";

export default {
  title: "Components/ClientAutocomplete",
  component: ClientAutocomplete,
};

/**
 * @typedef {Object} ClientAutocompleteProps
 * @property {string} value - Valor actual del autocompletador
 * @property {Function} onChange - Callback cuando cambia el valor
 * @property {string} placeholder - Texto placeholder
 */

export const Default = () => {
  const [value, setValue] = React.useState("");

  return (
    <div style={{ padding: "20px", width: "400px" }}>
      <ClientAutocomplete
        value={value}
        onChange={(v) => {
          console.log("Selected:", v);
          setValue(v);
        }}
        placeholder="Selecciona un cliente..."
      />
      <p style={{ marginTop: "10px" }}>Valor actual: {value}</p>
    </div>
  );
};

Default.storyName = "ClientAutocomplete";
Default.parameters = {
  docs: {
    description: {
      component: `
# ClientAutocomplete Component

Campo de autocompletación para seleccionar clientes con búsqueda en tiempo real.

## Propiedades

- **value**: Valor actual seleccionado
- **onChange**: Callback ejecutado cuando cambia la selección
- **placeholder**: Texto de ayuda

## Características

- Búsqueda en tiempo real
- Desplegable con resultados
- Integración con clientService
- Estilos con Tailwind CSS
- Manejo de errores de API

## Ejemplo de uso

\`\`\`jsx
const [selectedClient, setSelectedClient] = React.useState('');

<ClientAutocomplete
  value={selectedClient}
  onChange={setSelectedClient}
  placeholder="Buscar cliente..."
/>
\`\`\`
      `,
    },
  },
};
