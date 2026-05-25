import { Letter, LetterStatus } from "../types/Letter";
import { JSX } from "react";

function LetterKey({
  letter,
  status,
  width,
  onClick,
}: {
  letter: Letter;
  status: LetterStatus | null;
  width: number;
  onClick?: (letter: Letter) => void;
}) {
  const statusClasses: Map<LetterStatus | null, string> = new Map([
    [
      "correct",
      "bg-(--correct-color) text-(--key-evaluated-text-color) hover:bg-(--correct-color)/80 active:bg-(--correct-color)/60",
    ],
    [
      "present",
      "bg-(--present-color) text-(--key-evaluated-text-color) hover:bg-(--present-color)/80 active:bg-(--present-color)/60",
    ],
    [
      "absent",
      "bg-(--absent-color) text-(--key-evaluated-absent-text-color) hover:bg-(--absent-color)/80 active:bg-(--absent-color)/60",
    ],
    [
      "unevaluated",
      "bg-(--key-bg-color) text-(--key-text-color) hover:bg-(--key-bg-color)/80 active:bg-(--key-bg-color)/60",
    ],
    [
      null,
      "bg-(--key-bg-color) text-(--key-text-color) hover:bg-(--key-bg-color)/80 active:bg-(--key-bg-color)/60",
    ],
  ]);

  const label: JSX.Element = <span>{letter}</span>;

  return (
    <button
      className={`px-3 py-6.5 rounded h-14 flex items-center justify-center text-xl font-semibold cursor-pointer transition-colors duration-100 select-none ${statusClasses.get(status)}`}
      style={{ gridColumn: `span ${width}` }}
      aria-label={`Key ${letter}`}
      onClick={() => onClick?.(letter)}
    >
      {label}
    </button>
  );
}

export default LetterKey;
