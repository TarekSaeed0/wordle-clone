import { Language, Letter } from "./language";

export const LetterStatus = {
  Unevaluated: "unevaluated",
  Correct: "correct",
  Present: "present",
  Absent: "absent",
} as const;

export type LetterStatus = (typeof LetterStatus)[keyof typeof LetterStatus];

export type Tile = {
  letter: Letter;
  status: LetterStatus;
};

export type Row = Tile[];

export type Board = Row[];

export const GameStatus = {
  InProgress: "in_progress",
  Won: "won",
  Lost: "lost",
} as const;

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export type GameState = {
  language: Language;
  board: Board;
  currentRow: number;
  currentTile: number;
  status: GameStatus;
  answer: Letter[];
  invalidGuessCount: number;
};

export type GameOptions = {
  language: Language;
  wordLength: number;
  maximumGuesses: number;
};

export const GameActionType = {
  AddLetter: "add_letter",
  RemoveLetter: "remove_letter",
  SubmitGuess: "submit_guess",
} as const;

export type GameActionType =
  (typeof GameActionType)[keyof typeof GameActionType];

export type GameAction =
  | { type: typeof GameActionType.AddLetter; letter: Letter }
  | { type: typeof GameActionType.RemoveLetter }
  | { type: typeof GameActionType.SubmitGuess };
