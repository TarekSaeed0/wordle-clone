import { useContext, useEffect } from "react";
import { HeaderContext } from "../contexts/HeaderContext";
import { HeaderConfiguration } from "../types/header";

export function useHeader(configuration: HeaderConfiguration) {
  const context = useContext(HeaderContext);

  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }

  const { setConfiguration } = context;

  useEffect(() => {
    setConfiguration(configuration);

    return () => {
      setConfiguration({ title: "" });
    };
  }, [setConfiguration, configuration]);
}
