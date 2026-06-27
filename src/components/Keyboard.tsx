import { HiOutlineBackspace } from "react-icons/hi";
import { KeyType, Letter } from "../types/language";
import { LetterStatus } from "../types/game";
import { useMemo } from "react";
import { useLanguage } from "../hooks/useLanguage";
import LetterKey from "./LetterKey";
import FunctionKey from "./FunctionKey";

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
  const { keyboard } = useLanguage();

  const widths = useMemo(
    () => keyboard.map((row) => row.reduce((sum, key) => sum + key.width, 0)),
    [keyboard],
  );
  const maximumWidth = useMemo(() => Math.max(...widths), [widths]);

  return (
    <div
      className="grid gap-(--key-gap)"
      style={{ gridTemplateColumns: `repeat(${maximumWidth}, minmax(0, 1fr))` }}
    >
      {keyboard.map((row, rowIndex) => (
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
              case KeyType.Letter:
                return (
                  <LetterKey
                    key={keyIndex}
                    letter={key.letter}
                    status={status[key.letter] ?? "unevaluated"}
                    width={key.width}
                    onClick={onLetter}
                  />
                );
              case KeyType.Enter:
                return (
                  <FunctionKey
                    key={keyIndex}
                    width={key.width}
                    onClick={onEnter}
                  >
                    <span className="text-xs">ENTER</span>
                  </FunctionKey>
                );
              case KeyType.Backspace:
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
