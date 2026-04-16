import { Link } from "react-router-dom";
import { t } from "../i18n";

function UnderConstructionPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          {/* ICON */}
          <div className="mb-6 text-5xl">🚧</div>

          {/* TITLE */}
          <h1 className="text-2xl font-bold text-gray-900">
            {t("underConstruction.title")}
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-3 text-sm text-gray-600">
            {t("underConstruction.description")}
          </p>

          {/* BUTTON */}
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              {t("underConstruction.back")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UnderConstructionPage;
