import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

export function useLanguage() {
  const language = useContext(LanguageContext);
  if (!language) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return language;
}
