export type Letter = string;

export type Word = string;

export const KeyType = {
  Letter: "letter",
  Enter: "enter",
  Backspace: "backspace",
} as const;

export type KeyType = (typeof KeyType)[keyof typeof KeyType];

export type Key = (
  | {
      type: typeof KeyType.Letter;
      letter: Letter;
    }
  | {
      type: typeof KeyType.Enter;
    }
  | {
      type: typeof KeyType.Backspace;
    }
) & { width: number };

export type Keyboard = Key[][];

export const LanguageDirection = {
  LeftToRight: "ltr",
  RightToLeft: "rtl",
} as const;

export type LanguageDirection =
  (typeof LanguageDirection)[keyof typeof LanguageDirection];

export interface Language {
  id: string;
  name: string;
  direction: LanguageDirection;
  letters: Letter[];
  keyboard: Keyboard;
  normalizations: Record<Letter, Letter>;
}

export interface LanguageOption {
  id: string;
  name: string;
  wordLengths: number[];
}
