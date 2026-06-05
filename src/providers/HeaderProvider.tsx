import { useMemo, useState } from "react";
import { HeaderContext } from "../contexts/HeaderContext";
import Header from "../components/Header";
import { HeaderConfiguration } from "../types/header";

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [configuration, setConfiguration] = useState<HeaderConfiguration>({
    title: "",
  });

  const value = useMemo(() => ({ setConfiguration }), [setConfiguration]);

  return (
    <HeaderContext.Provider value={value}>
      <Header configuration={configuration} />
      {children}
    </HeaderContext.Provider>
  );
}
