import { KeyboardLayout } from "./KeyboardLayout";
import { Letter } from "./Letter";

export const LanguageDirection = {
  LeftToRight: "ltr",
  RightToLeft: "rtl",
} as const;

export type LanguageDirection =
  (typeof LanguageDirection)[keyof typeof LanguageDirection];

export interface Language {
  name: string;
  direction: LanguageDirection;
  letters: Letter[];
  keyboardLayout: KeyboardLayout;
  normalization: Record<Letter, Letter>;
}
