import DataTable from "./DataTable";

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
  <div style={{ padding: "20px" }}>
    <DataTable
      columns={mockColumns}
      hasData={mockData.length > 0}
      footer={<span>3 registros cargados</span>}
    >
      {mockData.map((row) => (
        <tr key={row.id}>
          <td className="px-6 py-4">{row.id}</td>
          <td className="px-6 py-4">{row.name}</td>
          <td className="px-6 py-4">{row.email}</td>
          <td className="px-6 py-4">{row.role}</td>
        </tr>
      ))}
    </DataTable>
  </div>
);

export const Loading = () => (
  <div style={{ padding: "20px" }}>
    <DataTable columns={mockColumns} hasData={true}>
      <tr>
        <td className="px-6 py-4 text-gray-500" colSpan={mockColumns.length}>
          Cargando filas...
        </td>
      </tr>
    </DataTable>
  </div>
);

export const Empty = () => (
  <div style={{ padding: "20px" }}>
    <DataTable
      columns={mockColumns}
      hasData={false}
      emptyMessage="No hay registros para mostrar."
    />
  </div>
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
- **children**: Filas renderizadas dentro de \`tbody\`
- **hasData**: Boolean para mostrar la tabla o el estado vacío
- **emptyMessage**: Mensaje para estado sin resultados
- **footer**: Nodo opcional para paginación o resumen

## Características

- Tabla desacoplada de la lógica de negocio
- Responsive con scroll horizontal
- Footer opcional para paginación
- Manejo de estado vacío
- Compatible con filas complejas y acciones custom

## Ejemplo de uso

\`\`\`jsx
<DataTable
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
  ]}
  hasData={users.length > 0}
>
  {users.map((user) => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
    </tr>
  ))}
</DataTable>
\`\`\`
      `,
    },
  },
};
