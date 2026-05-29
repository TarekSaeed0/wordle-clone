import { createContext } from "react";
import { Language } from "../types/language";

export const LanguageContext = createContext<Language | null>(null);
