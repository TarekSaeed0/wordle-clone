import { createContext } from "react";
import { Language } from "../types/language";
import languageFromJson from "../utils/languageFromJson";
import english from "../data/english.json";

const LanguageContext = createContext<Language>(languageFromJson(english));

export default LanguageContext;
