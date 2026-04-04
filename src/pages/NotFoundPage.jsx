import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { t } from "../i18n";

function NotFoundPage() {
  const { user } = useAuth();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          {t("notFound.title")}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {t("notFound.description")}
        </p>

        <div className="mt-6">
          <Link
            to={user ? "/dashboard" : "/login"}
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {t("notFound.back")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
