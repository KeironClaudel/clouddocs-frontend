import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import DocumentsPage from "./pages/DocumentsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import AdminRoute from "./components/AdminRoute";
import UsersPage from "./pages/UsersPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import CategoriesPage from "./pages/CategoriesPage";
import UploadDocumentPage from "./pages/UploadDocumentPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";
import DocumentTypePage from "./pages/DocumentTypePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DocumentsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/document-types"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DocumentTypePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AppLayout>
                  <UsersPage />
                </AppLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ChangePasswordPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AppLayout>
                  <CategoriesPage />
                </AppLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents/upload"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UploadDocumentPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AppLayout>
                  <AuditLogsPage />
                </AppLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
