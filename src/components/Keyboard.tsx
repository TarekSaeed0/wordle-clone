import { HiOutlineBackspace } from "react-icons/hi";
import { KeyboardLayoutKeyType } from "../types/keyboard";
import { Letter } from "../types/language";
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
  const { keyboardLayout } = useLanguage();

  const widths = useMemo(
    () =>
      keyboardLayout.map((row) => row.reduce((sum, key) => sum + key.width, 0)),
    [keyboardLayout],
  );
  const maximumWidth = useMemo(() => Math.max(...widths), [widths]);

  return (
    <div
      className="grid gap-(--key-gap)"
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
