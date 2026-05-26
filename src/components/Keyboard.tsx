import { HiOutlineBackspace } from "react-icons/hi";
import { KeyboardLayoutKeyType } from "../types/KeyboardLayout";
import { Letter } from "../types/Letter";
import { LetterStatus } from "../types/Letter";
import FunctionKey from "./FunctionKey";
import LetterKey from "./LetterKey";
import { useContext, useMemo } from "react";
import LanguageContext from "../context/LanguageContext";

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
