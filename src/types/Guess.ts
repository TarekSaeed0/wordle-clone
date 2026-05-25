import { LetterStatus } from "./Letter";

export type Guess = {
  letter: string;
  status: LetterStatus;
}[];
