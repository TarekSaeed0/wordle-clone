import { KeyboardLayoutKeyType } from "../types/KeyboardLayout";
import { Language, LanguageDirection } from "../types/Language";
import { Letter } from "../types/Letter";

export const English: Language = {
  name: "English",
  direction: LanguageDirection.LeftToRight,
  letters: [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
  keyboardLayout: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => ({
      type: KeyboardLayoutKeyType.Letter,
      value: letter,
      width: 2,
    })),
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => ({
      type: KeyboardLayoutKeyType.Letter,
      value: letter,
      width: 2,
    })),
    [
      { type: KeyboardLayoutKeyType.Enter, width: 3 },
      ...["Z", "X", "C", "V", "B", "N", "M"].map((letter) => ({
        type: KeyboardLayoutKeyType.Letter,
        value: letter,
        width: 2,
      })),
      { type: KeyboardLayoutKeyType.Backspace, width: 3 },
    ],
  ],
  normalization: "abcdefghijklmnopqrstuvwxyz".split("").reduce(
    (record, letter) => {
      record[letter] = letter.toUpperCase();
      return record;
    },
    {} as Record<Letter, Letter>,
  ),
};
