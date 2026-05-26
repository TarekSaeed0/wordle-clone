import { createContext } from "react";
import { Language } from "../types/Language";
import { English } from "../data/English";

const LanguageContext = createContext<Language>(English);

export default LanguageContext;
