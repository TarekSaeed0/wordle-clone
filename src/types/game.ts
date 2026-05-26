export type LetterStatus = (typeof LetterStatus)[keyof typeof LetterStatus];

export const LetterStatus = {
  Unevaluated: "unevaluated",
  Correct: "correct",
  Present: "present",
  Absent: "absent",
} as const;

export type Guess = {
  letter: string;
  status: LetterStatus;
}[];
