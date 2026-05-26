import { Letter } from "./language";

export const KeyboardLayoutKeyType = {
  Letter: "letter",
  Enter: "enter",
  Backspace: "backspace",
} as const;

export type KeyboardLayoutKeyType =
  (typeof KeyboardLayoutKeyType)[keyof typeof KeyboardLayoutKeyType];

export type KeyboardLayoutKey = (
  | {
      type: typeof KeyboardLayoutKeyType.Letter;
      value: Letter;
    }
  | {
      type: typeof KeyboardLayoutKeyType.Enter;
    }
  | {
      type: typeof KeyboardLayoutKeyType.Backspace;
    }
) & { width: number };

export type KeyboardLayout = KeyboardLayoutKey[][];
