import { Language } from "../types/language";
import { LanguageContext } from "../contexts/LanguageContext";

export function LanguageProvider({
  language,
  children,
}: {
  language: Language | null;
  children: React.ReactNode;
}) {
  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
}
