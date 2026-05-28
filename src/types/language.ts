import { KeyboardLayout } from "./keyboard";

export type Letter = string;

export const LanguageDirection = {
  LeftToRight: "ltr",
  RightToLeft: "rtl",
} as const;

export type LanguageDirection =
  (typeof LanguageDirection)[keyof typeof LanguageDirection];

export type LanguageDictionary = Record<
  number,
  { guesses: string[]; answers: string[] }
>;

export interface Language {
  name: string;
  direction: LanguageDirection;
  letters: Letter[];
  keyboardLayout: KeyboardLayout;
  normalization: Record<Letter, Letter>;
  dictionary: LanguageDictionary;
}
