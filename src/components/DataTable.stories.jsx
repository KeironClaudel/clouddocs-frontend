import React, { useState } from "react";
import DataTable from "../src/components/DataTable";

export default {
  title: "Components/DataTable",
  component: DataTable,
};

/**
 * @typedef {Object} DataTableProps
 * @property {Array<{key: string, label: string}>} columns - Definición de columnas
 * @property {Array<Object>} data - Datos a mostrar en la tabla
 * @property {boolean} loading - Estado de carga
 * @property {Function} onEdit - Callback cuando se edita un elemento
 * @property {Function} onDelete - Callback cuando se elimina un elemento
 */

const mockColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "email", label: "Email" },
  { key: "role", label: "Rol" },
];

const mockData = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Admin" },
  { id: 2, name: "María García", email: "maria@example.com", role: "Usuario" },
  { id: 3, name: "Carlos López", email: "carlos@example.com", role: "Usuario" },
];

export const Default = () => (
  <DataTable
    columns={mockColumns}
    data={mockData}
    loading={false}
    onEdit={(row) => console.log("Editing:", row)}
    onDelete={(row) => console.log("Deleting:", row)}
  />
);

export const Loading = () => (
  <DataTable
    columns={mockColumns}
    data={[]}
    loading={true}
    onEdit={() => {}}
    onDelete={() => {}}
  />
);

export const Empty = () => (
  <DataTable
    columns={mockColumns}
    data={[]}
    loading={false}
    onEdit={() => {}}
    onDelete={() => {}}
  />
);

Default.storyName = "DataTable";
Default.parameters = {
  docs: {
    description: {
      component: `
# DataTable Component

Tabla genérica y reutilizable para mostrar datos en la aplicación.

## Propiedades

- **columns**: Array de objetos con \`key\` y \`label\`
- **data**: Array de objetos con los datos a mostrar
- **loading**: Boolean para mostrar estado de carga
- **onEdit**: Callback ejecutado al hacer click en editar
- **onDelete**: Callback ejecutado al hacer click en eliminar

## Características

- Soporte para datos dinámicos
- Estado de carga visual
- Botones de edición y eliminación
- Responsive
- Manejo de filas vacías

## Ejemplo de uso

\`\`\`jsx
<DataTable
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
  ]}
  data={users}
  loading={isLoading}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
\`\`\`
      `,
    },
  },
};
