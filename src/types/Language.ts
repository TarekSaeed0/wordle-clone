import { KeyboardLayout } from "./KeyboardLayout";
import { Letter } from "./Letter";

export type LanguageDirection = "ltr" | "rtl";

export interface Language {
  name: string;
  direction: LanguageDirection;
  letters: Letter[];
  keyboardLayout: KeyboardLayout;
}
