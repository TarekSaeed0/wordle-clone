import { KeyboardLayoutKeyType } from "../types/KeyboardLayout";
import { Language, LanguageDirection } from "../types/Language";
import { Letter } from "../types/Letter";

export const Arabic: Language = {
  name: "Arabic",
  direction: LanguageDirection.RightToLeft,
  letters: [..."ابتثجحخدذرزسشصضطظعغفقكلمنهويءةى"],
  keyboardLayout: [
    ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"].map(
      (letter) => ({
        type: KeyboardLayoutKeyType.Letter,
        value: letter as Letter,
        width: 2,
      }),
    ),
    ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط", "ذ"].map(
      (letter) => ({
        type: KeyboardLayoutKeyType.Letter,
        value: letter as Letter,
        width: 2,
      }),
    ),
    [
      { type: KeyboardLayoutKeyType.Enter, width: 3 },
      ...["ئ", "ء", "ؤ", "ر", "ى", "ة", "و", "ز", "ظ"].map((letter) => ({
        type: KeyboardLayoutKeyType.Letter,
        value: letter as Letter,
        width: 2,
      })),
      { type: KeyboardLayoutKeyType.Backspace, width: 3 },
    ],
  ],
  normalization: {},
};
