import { useContext } from "react";
import LanguageContext from "../context/LanguageContext";
import { Guess } from "../types/game";
import { LetterStatus } from "../types/game";
import { Letter } from "../types/language";

function Tile({ letter, status }: { letter?: Letter; status?: LetterStatus }) {
  const statusClasses: Map<LetterStatus | null, string> = new Map([
    [
      LetterStatus.Correct,
      "bg-(--correct-color) border-(--correct-color) text-(--key-evaluated-text-color)",
    ],
    [
      LetterStatus.Present,
      "bg-(--present-color) border-(--present-color) text-(--key-evaluated-text-color)",
    ],
    [
      LetterStatus.Absent,
      "bg-(--absent-color) border-(--absent-color) text-(--key-evaluated-absent-text-color)",
    ],
    [
      LetterStatus.Unevaluated,
      "border-(--tile-unevaluated-border-color) text-(--key-text-color)",
    ],
    [null, "border-(--tile-border-color) text-(--key-text-color)"],
  ]);

  return (
    <div
      className={`min-w-13 aspect-square border-2 flex items-center justify-center text-[2rem] font-bold uppercase select-none ${statusClasses.get(status ?? null)}`}
    >
      {letter}
    </div>
  );
}

function Row({
  wordLength,
  guess,
  className = "",
}: {
  wordLength: number;
  guess?: Guess;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-subgrid gap-1.5 col-span-full ${className}`}
    >
      {Array.from({ length: wordLength }).map((_, j) => (
        <Tile key={j} letter={guess?.[j]?.letter} status={guess?.[j]?.status} />
      ))}
    </div>
  );
}

function Board({
  wordLength,
  guessCount,
  guesses,
  invalidGuessKey = 0,
}: {
  wordLength: number;
  guessCount: number;
  guesses: Guess[];
  invalidGuessKey: number;
}) {
  const { direction } = useContext(LanguageContext);

  const currentGuessIndex = guesses.length - 1;

  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateRows: `repeat(${guessCount}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`,
        direction,
      }}
    >
      {Array.from({ length: guessCount }).map((_, i) => (
        <Row
          key={i === currentGuessIndex ? `${i}-${invalidGuessKey}` : i}
          wordLength={wordLength}
          guess={guesses[i]}
          className={`${
            i === currentGuessIndex && invalidGuessKey !== 0
              ? "animate-shake"
              : ""
          }`}
        />
      ))}
    </div>
  );
}

export default Board;
