# CloudDocs Frontend

CloudDocs frontend built with React 19 and Vite. The application covers authentication with `httpOnly` cookies, document management, admin catalogs, client management, user profile flows, and Storybook-based component documentation.

## Current status

- The app is organized around `pages`, `hooks`, `services`, `mappers`, `validators`, and `utils`.
- The UI is primarily built with Tailwind CSS and FontAwesome.
- Storybook is configured and documents the reusable domain components.
- The active i18n dictionary is Spanish (`src/i18n/es.js`).

## Implemented features

- Login, forgot password, and reset password flows.
- PDF upload with validation, categories, types, client selection, access levels, and visible departments.
- Document listing with filters, pagination, preview, download, rename, versioning, and send-to-client actions.
- Admin catalogs for users, clients, categories, departments, document types, and document access levels.
- Dashboard, profile, change password, and audit logs.
- Route guards through `ProtectedRoute` and `AdminRoute`.
- Granular navigation visibility through dedicated permission helpers in `permissionUtils`.

## Stack

- React 19
- Vite 8
- React Router DOM 7
- Axios
- Tailwind CSS 4
- FontAwesome
- Storybook 8
- ESLint

## Actual structure

```text
src/
├── api/              # Axios instance and global 401 handling
├── assets/           # Static assets used by the frontend
├── components/       # Reusable components and domain stories
├── context/          # AuthContext and exported context value
├── hooks/            # Page/use-case hooks
├── i18n/             # Spanish dictionary and t() helper
├── mappers/          # Initial state and payload builders
├── pages/            # Route-level screens
├── services/         # Backend API clients
├── stories/          # Storybook scaffold demo stories
├── utils/            # Permissions, dates, errors, and role options
└── validators/       # Form validation
```

## Routes

### Public

- `/` redirects to `/login`
- `/login`
- `/reset-password`
- `/under-construction`

### Protected

- `/dashboard`
- `/documents`
- `/documents/upload`
- `/profile`
- `/change-password`
- `/clients`
- `/document-types`

### Protected + `AdminRoute`

- `/users`
- `/categories`
- `/departments`
- `/audit-logs`
- `/document-access-levels`

## Environment variables

Create a `.env` file with:

```env
VITE_API_BASE_URL=https://localhost:7121/api
VITE_ADMIN_GUID=<admin-role-guid>
VITE_USER_GUID=<user-role-guid>
VITE_MAX_FILE_SIZE_BYTES=20971520
```

Note: the frontend now tolerates either a plain byte value or a simple multiplicative expression for `VITE_MAX_FILE_SIZE_BYTES`, but an integer is the recommended format.

## Scripts

- `npm run dev`: start the HTTPS development server.
- `npm run build`: create a production build with Vite.
- `npm run preview`: preview the production build locally.
- `npm run lint`: run ESLint.
- `npm run storybook`: start Storybook locally.
- `npm run build-storybook`: generate the static Storybook build.

## Recently reflected changes

- Initial hook state moved into `mappers` for `useDocuments` and `useUploadDocument`.
- Responsive cancel button adjustment in `UploadDocumentPage`.
- Component stories realigned with the current APIs for `Navbar`, `DataTable`, `ClientAutocomplete`, and `SendToClientModal`.
- Fixed `VITE_MAX_FILE_SIZE_BYTES` parsing so PDF size validation actually works.

## Extended documentation

Expanded project documentation lives in `C:\Users\Keiron\Desktop\DOC FRONTEND` and was updated to match the current codebase:

- `README.md`
- `RESUMEN_EJECUTIVO.md`
- `API_REFERENCE.md`
- `HOOKS_DOCUMENTATION.md`
- `SERVICES_DOCUMENTATION.md`
- `COMPONENTS_JSDoc.md`
- `STORYBOOK_GUIDE.md`
- `INDEX.md`

## Useful notes

- `Navbar` now combines direct navigation links with a profile/actions dropdown menu.
- Navigation visibility is controlled through dedicated permission helpers such as `canViewClients`, `canViewUsers`, `canViewAuditLogs`, `canViewCategories`, `canViewDepartments`, `canViewDocumentAccessLevels`, and `canViewDocumentTypes`.
- `canManageAdminPanels(user)` still identifies admin-level access, but navigation is no longer documented as a single admin-only toggle.
- The active UI dictionary is Spanish; there is no language switcher in the interface yet.
- Vitest and Playwright packages are installed, but there is still no test script in `package.json`.
