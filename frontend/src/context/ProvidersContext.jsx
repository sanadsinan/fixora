import { createContext, useContext, useEffect, useState } from "react";
import { providers as baseProviders } from "../data/providers";

const ProvidersContext = createContext(null);
const STORAGE_KEY = "fixora-provider-edits";

// Read the saved edits from the browser (or start with none)
function loadEdits() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function ProvidersProvider({ children }) {
  const [edits, setEdits] = useState(loadEdits);

  // Save the edits whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
    } catch {
      // storage full or blocked: ignore
    }
  }, [edits]);

  // The sample data, with each provider's saved edits placed on top
  const providers = baseProviders.map((p) => ({ ...p, ...edits[p.id] }));

  const updateProvider = (id, changes) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...changes } }));
  };

  return (
    <ProvidersContext.Provider value={{ providers, updateProvider }}>
      {children}
    </ProvidersContext.Provider>
  );
}

export function useProviders() {
  return useContext(ProvidersContext);
}