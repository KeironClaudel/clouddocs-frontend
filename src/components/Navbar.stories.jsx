import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../context/authContextValue";

const createAuthValue = (role, fullName) => ({
  user: {
    fullName,
    role,
  },
  login: () => {},
  logout: () => {},
  isAuthReady: true,
});

const withProviders =
  (authValue, initialEntries = ["/dashboard"]) =>
  (Story) => {
    const StoryComponent = Story;

    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthContext.Provider value={authValue}>
          <div className="min-h-screen bg-gray-100">
            <StoryComponent />
          </div>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

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

export const AdminView = () => <Navbar />;

AdminView.storyName = "Admin Navbar";
AdminView.decorators = [
  withProviders(createAuthValue("Admin", "Ana Admin"), ["/clients"]),
];
AdminView.parameters = {
  docs: {
    description: {
      component: `
# Navbar Component

La barra de navegación principal de la aplicación. Incluye:

- **Links dinámicos**: Se muestran basados en los permisos del usuario
- **Estado activo**: Destaca el link de la ruta actual
- **Logout**: Botón para cerrar sesión
- **Responsive**: Tiene variantes móvil y desktop
- **Admin Panel**: Links administrativos visibles para admins

## Características

- Navegación contextual según rol
- Integración con React Router
- Integración con AuthContext
- Estilos responsivos con Tailwind CSS
- Iconos con FontAwesome

## Uso

\`\`\`jsx
import Navbar from './components/Navbar';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from './context/authContextValue';

function StoryWrapper() {
  return (
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthValue}>
        <Navbar />
      </AuthContext.Provider>
    </MemoryRouter>
  );
}
\`\`\`
      `,
    },
  },
};

export const UserView = () => <Navbar />;

UserView.storyName = "Standard User Navbar";
UserView.decorators = [
  withProviders(createAuthValue("User", "Uriel Usuario"), ["/documents"]),
];
