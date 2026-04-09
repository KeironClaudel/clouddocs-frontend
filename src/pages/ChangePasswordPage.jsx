import { t } from "../i18n";
import { useChangePassword } from "../hooks/useChangePassword";

function ChangePasswordPage() {
  const {
    confirmPassword,
    currentPassword,
    error,
    handleSubmit,
    loading,
    newPassword,
    setConfirmPassword,
    setCurrentPassword,
    setNewPassword,
    successMessage,
  } = useChangePassword();

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("changePassword.title")}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {t("changePassword.subtitle")}
          </p>

          {successMessage && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("changePassword.form.currentPassword")}
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("changePassword.form.newPassword")}
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("changePassword.form.confirmPassword")}
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                disabled={loading}
              >
                {loading
                  ? t("changePassword.buttons.saving")
                  : t("changePassword.buttons.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ChangePasswordPage;
