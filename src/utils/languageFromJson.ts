import { Language } from "../types/language";

export type LanguageJson = {
  name: string;
  direction: string;
  letters: string[];
  keyboardLayout: {
    type: string;
    value?: string | undefined;
    width: number;
  }[][];
  normalization: Record<string, string>;
  dictionary: Record<number, { guesses: string[]; answers: string[] }>;
};

export function languageFromJson(language: LanguageJson): Language {
  return {
    name: language.name,
    direction: language.direction as Language["direction"],
    letters: language.letters as Language["letters"],
    keyboardLayout: language.keyboardLayout as Language["keyboardLayout"],
    normalization: language.normalization as Language["normalization"],
    dictionary: Object.fromEntries(
      Object.entries(language.dictionary).map(
        ([wordLength, { guesses, answers }]) => [
          wordLength,
          { guesses: new Set([...guesses, ...answers]), answers },
        ],
      ),
    ) as Language["dictionary"],
  };
}
