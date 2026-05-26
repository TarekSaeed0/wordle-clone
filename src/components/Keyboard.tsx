import { HiOutlineBackspace } from "react-icons/hi";
import { KeyboardLayoutKeyType } from "../types/keyboard";
import { Letter } from "../types/language";
import { LetterStatus } from "../types/game";
import { useContext, useMemo } from "react";
import LanguageContext from "../context/LanguageContext";

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
      className={`px-3 py-6.5 rounded h-14 flex items-center justify-center text-xl font-semibold uppercase cursor-pointer transition-colors duration-100 select-none ${statusClasses[status]}`}
      style={{ gridColumn: `span ${width}`, direction }}
      aria-label={`Key ${letter}`}
      onClick={() => onClick?.(letter)}
    >
      {letter}
    </button>
  );
}

function FunctionKey({
  width,
  onClick,
  children,
}: {
  width: number;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`px-3 py-2 rounded h-14 flex items-center justify-center text-sm font-semibold cursor-pointer transition-colors duration-100 bg-(--key-bg-color) text-(--key-text-color) hover:bg-(--key-bg-color)/80 active:bg-(--key-bg-color)/60 select-none`}
      style={{ gridColumn: `span ${width}` }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Keyboard({
  status,
  onLetter,
  onEnter,
  onBackspace,
}: {
  status: Record<Letter, LetterStatus>;
  onLetter: (letter: Letter) => void;
  onEnter: () => void;
  onBackspace: () => void;
}) {
  const { keyboardLayout } = useContext(LanguageContext);

  const widths = useMemo(
    () =>
      keyboardLayout.map((row) => row.reduce((sum, key) => sum + key.width, 0)),
    [keyboardLayout],
  );
  const maximumWidth = useMemo(() => Math.max(...widths), [widths]);

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${maximumWidth}, minmax(0, 1fr))` }}
    >
      {keyboardLayout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-1.5 grid-cols-subgrid col-span-full"
          style={{
            gridColumnStart:
              Math.floor((maximumWidth - widths[rowIndex]) / 2) + 1,
          }}
        >
          {row.map((key, keyIndex) => {
            switch (key.type) {
              case KeyboardLayoutKeyType.Letter:
                return (
                  <LetterKey
                    key={keyIndex}
                    letter={key.value}
                    status={status[key.value] ?? "unevaluated"}
                    width={key.width}
                    onClick={onLetter}
                  />
                );
              case KeyboardLayoutKeyType.Enter:
                return (
                  <FunctionKey
                    key={keyIndex}
                    width={key.width}
                    onClick={onEnter}
                  >
                    <span className="text-xs">ENTER</span>
                  </FunctionKey>
                );
              case KeyboardLayoutKeyType.Backspace:
                return (
                  <FunctionKey
                    key={keyIndex}
                    width={key.width}
                    onClick={onBackspace}
                  >
                    <HiOutlineBackspace size={22} />
                  </FunctionKey>
                );
            }
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
