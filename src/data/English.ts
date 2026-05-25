import { KeyboardLayoutKeyType } from "../types/KeyboardLayout";
import { Language } from "../types/Language";

export const English: Language = {
  name: "English",
  direction: "ltr",
  letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  keyboardLayout: [
    "QWERTYUIOP".split("").map((letter) => ({
      type: KeyboardLayoutKeyType.Letter,
      value: letter,
      width: 2,
    })),
    "ASDFGHJKL".split("").map((letter) => ({
      type: KeyboardLayoutKeyType.Letter,
      value: letter,
      width: 2,
    })),
    [
      { type: KeyboardLayoutKeyType.Enter, width: 3 },
      ..."ZXCVBNM".split("").map((letter) => ({
        type: KeyboardLayoutKeyType.Letter,
        value: letter,
        width: 2,
      })),
      { type: KeyboardLayoutKeyType.Backspace, width: 3 },
    ],
  ],
};
