import { Letter, LetterStatus } from "../types/Letter";

function Tile({ letter, status }: { letter: Letter | null; status: LetterStatus | null }) {
  const statusClasses: Map<LetterStatus | null, string> = new Map([
    ["correct", "bg-(--correct-color) border-(--correct-color) text-(--key-evaluated-text-color)"],
    ["present", "bg-(--present-color) border-(--present-color) text-(--key-evaluated-text-color)"],
    ["absent", "bg-(--absent-color) border-(--absent-color) text-(--key-evaluated-absent-text-color)"],
    ["unevaluated", "border-(--tile-unevaluated-border-color) text-(--key-text-color)"],
    [null, "border-(--tile-border-color) text-(--key-text-color)"],
  ]);

  return (
    <div className={`min-w-13 aspect-square border-2 ${statusClasses.get(status)} flex items-center justify-center text-[2rem] font-bold uppercase`}>
      { letter }
    </div>
  );
}

export default Tile;