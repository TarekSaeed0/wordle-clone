import { createContext } from "react";
import { HeaderConfiguration } from "../types/header";

export type HeaderContextValue = {
  setConfiguration: (configuration: HeaderConfiguration) => void;
};

export const HeaderContext = createContext<HeaderContextValue | null>(null);
