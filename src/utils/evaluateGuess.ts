import { LetterStatus } from "../types/game";
import { Letter } from "../types/language";

function evaluateGuess(guess: Letter[], target: Letter[]): LetterStatus[] {
  const statuses: LetterStatus[] = Array.from(
    { length: guess.length },
    () => LetterStatus.Absent,
  );

  const targetLetterCount = target.reduce(
    (count, letter) => {
      count[letter] = (count[letter] || 0) + 1;
      return count;
    },
    {} as Record<Letter, number>,
  );

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      statuses[i] = LetterStatus.Correct;
      targetLetterCount[guess[i]]--;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (statuses[i] === LetterStatus.Correct) {
      continue;
    }

    if (targetLetterCount[guess[i]] > 0) {
      statuses[i] = LetterStatus.Present;
      targetLetterCount[guess[i]]--;
    }
  }

  return statuses;
}

export default evaluateGuess;
