import { t } from "../i18n";

/**
 * Renders a confirmation modal to send a document to its client.
 */
function SendToClientModal({
  documentName,
  clientName,
  subject,
  message,
  onSubjectChange,
  onMessageChange,
  onCancel,
  onConfirm,
  sending,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900">
          {t("documents.sendToClient.title")}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {t("documents.sendToClient.subtitle")}
        </p>

        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <p>
            <span className="font-medium text-gray-900">
              {t("documents.sendToClient.document")}:
            </span>{" "}
            {documentName}
          </p>
          <p className="mt-1">
            <span className="font-medium text-gray-900">
              {t("documents.sendToClient.client")}:
            </span>{" "}
            {clientName}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("documents.sendToClient.subject")}
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              disabled={sending}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("documents.sendToClient.message")}
            </label>
            <textarea
              className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              disabled={sending}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-70"
            onClick={onConfirm}
            disabled={sending}
          >
            {sending
              ? t("documents.buttons.sendingToClient")
              : t("documents.buttons.sendToClient")}
          </button>

          <button
            type="button"
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
            onClick={onCancel}
            disabled={sending}
          >
            {t("documents.buttons.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendToClientModal;
