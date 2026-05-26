import LanguageContext from "../context/LanguageContext";
import { Letter, LetterStatus } from "../types/Letter";
import { JSX, useContext } from "react";

function LetterKey({
  letter,
  status,
  width,
  onClick,
}: {
  letter: Letter;
  status: LetterStatus;
  width: number;
  onClick?: (letter: Letter) => void;
}) {
  const { direction } = useContext(LanguageContext);

  const statusClasses: Record<LetterStatus, string> = {
    [LetterStatus.Correct]:
      "bg-(--correct-color) text-(--key-evaluated-text-color) hover:bg-(--correct-color)/80 active:bg-(--correct-color)/60",
    [LetterStatus.Present]:
      "bg-(--present-color) text-(--key-evaluated-text-color) hover:bg-(--present-color)/80 active:bg-(--present-color)/60",
    [LetterStatus.Absent]:
      "bg-(--absent-color) text-(--key-evaluated-absent-text-color) hover:bg-(--absent-color)/80 active:bg-(--absent-color)/60",
    [LetterStatus.Unevaluated]:
      "bg-(--key-bg-color) text-(--key-text-color) hover:bg-(--key-bg-color)/80 active:bg-(--key-bg-color)/60",
  };

  return (
    <button
      className={`px-3 py-6.5 rounded h-14 flex items-center justify-center text-xl font-semibold cursor-pointer transition-colors duration-100 select-none ${statusClasses[status]}`}
      style={{ gridColumn: `span ${width}`, direction }}
      aria-label={`Key ${letter}`}
      onClick={() => onClick?.(letter)}
    >
      {letter}
    </button>
  );
}

export default LetterKey;
