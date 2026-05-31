import { LetterStatus } from "../types/game";
import type { Tile } from "../types/game";

function Tile({ tile }: { tile: Tile }) {
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
      className={`aspect-square border-2 flex items-center justify-center text-[2rem] font-bold uppercase select-none ${statusClasses.get(tile.status ?? null)}`}
    >
      {tile.letter}
    </div>
  );
}

export default Tile;
