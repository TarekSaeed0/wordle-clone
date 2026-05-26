import { Letter, LetterStatus } from "../types/Letter";

function Tile({
  letter,
  status,
}: {
  letter: Letter | null;
  status: LetterStatus | null;
}) {
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
      className={`min-w-13 aspect-square border-2 flex items-center justify-center text-[2rem] font-bold uppercase select-none ${statusClasses.get(status)}`}
    >
      {letter}
    </div>
  );
}

export default Tile;
