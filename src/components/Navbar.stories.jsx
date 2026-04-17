import React from "react";
import Navbar from "./Navbar";

export default {
  title: "Components/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
};

/**
 * @typedef {Object} NavbarProps
 * Propiedades del componente Navbar
 */

export const Default = () => <Navbar />;

Default.storyName = "Navbar";
Default.parameters = {
  docs: {
    description: {
      component: `
# Navbar Component

La barra de navegación principal de la aplicación. Incluye:

- **Links dinámicos**: Se muestran basados en los permisos del usuario
- **Estado activo**: Destaca el link de la ruta actual
- **Logout**: Botón para cerrar sesión
- **Admin Panel**: Links a funcionalidades administrativas (solo para admins)

## Características

- Validación automática de permisos
- Navegación contextual según rol del usuario
- Estilos responsivos con Tailwind CSS
- Iconos con FontAwesome

## Uso

\`\`\`jsx
import Navbar from './components/Navbar';

function AppLayout() {
  return (
    <div>
      <Navbar />
      {/* resto del contenido */}
    </div>
  );
}
\`\`\`

## Rutas disponibles

- \`/dashboard\`: Panel de control (protegido)
- \`/documents\`: Gestor de documentos (protegido)
- \`/profile\`: Perfil del usuario (protegido)
- \`/users\`: Gestión de usuarios (admin)
- \`/categories\`: Gestión de categorías (admin)
- \`/departments\`: Gestión de departamentos (admin)
- \`/clients\`: Gestión de clientes (protegido)
      `,
    },
  },
};
