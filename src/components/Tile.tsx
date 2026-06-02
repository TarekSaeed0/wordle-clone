import { LetterStatus } from "../types/game";
import type { Tile } from "../types/game";

function Tile({ tile, index }: { tile: Tile; index: number }) {
  const statusClasses: Record<LetterStatus, string> = {
    [LetterStatus.Correct]:
      "bg-(--correct-color) border-(--correct-color) text-(--key-evaluated-text-color)",
    [LetterStatus.Present]:
      "bg-(--present-color) border-(--present-color) text-(--key-evaluated-text-color)",
    [LetterStatus.Absent]:
      "bg-(--absent-color) border-(--absent-color) text-(--key-evaluated-absent-text-color)",
    [LetterStatus.Unevaluated]:
      "border-(--tile-unevaluated-border-color) text-(--key-text-color)",
  };

  const duration = 400;
  const delay = index * 400;

  return (
    <div
      key={tile.status}
      className={`aspect-square border-2 flex items-center justify-center text-[2rem] font-bold uppercase select-none ${tile.letter === "" ? "border-(--tile-border-color) text-(--key-text-color)" : statusClasses[tile.status]} ${
        tile.status !== LetterStatus.Unevaluated ? "animate-reveal" : ""
      }`}
      style={{
        animationDelay: `${delay}ms, 0ms`,
        animationDuration: `${duration}ms, ${delay + duration / 2}ms`,
      }}
    >
      {tile.letter}
    </div>
  );
}

export default Tile;
