export type Letter = string;

export const LetterStatus = {
  Unevaluated: "unevaluated",
  Correct: "correct",
  Present: "present",
  Absent: "absent",
} as const;

export type LetterStatus = (typeof LetterStatus)[keyof typeof LetterStatus];
