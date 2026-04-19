import { useEffect, useMemo, useRef, useState } from "react";
import { getClientLabel } from "../utils/clientUtils";

/**
 * Renders an autocomplete input for selecting a client.
 */
function ClientAutocomplete({
  searchTerm = "",
  setSearchTerm = () => {},
  options = [],
  loading = false,
  selectedClientId = null,
  onSelectClient = () => {},
  placeholder = "",
  emptyText = "No results",
  loadingText = "Loading...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedClient = useMemo(() => {
    return options.find(
      (client) => String(client.id) === String(selectedClientId),
    );
  }, [options, selectedClientId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      {selectedClient && !searchTerm.trim() && (
        <p className="mt-1 text-xs text-gray-500">
          {getClientLabel(selectedClient)}
        </p>
      )}

      {isOpen && searchTerm.trim() && (
        <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500">{loadingText}</div>
          ) : options.length > 0 ? (
            options.map((client) => (
              <button
                key={client.id}
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                onClick={() => {
                  onSelectClient(client);
                  setSearchTerm(getClientLabel(client));
                  setIsOpen(false);
                }}
              >
                {getClientLabel(client)}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">{emptyText}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientAutocomplete;
