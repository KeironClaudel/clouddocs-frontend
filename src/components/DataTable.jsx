function DataTable({
  columns,
  children,
  emptyMessage = "No records found.",
  hasData = true,
  footer = null,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {!hasData ? (
        <div className="px-6 py-8 text-sm text-gray-600">{emptyMessage}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {children}
              </tbody>
            </table>
          </div>

          {footer && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-sm text-gray-600">
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DataTable;
