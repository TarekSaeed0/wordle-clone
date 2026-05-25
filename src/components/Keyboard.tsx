import { HiOutlineBackspace } from "react-icons/hi";
import { KeyboardLayout, KeyboardLayoutKeyType } from "../types/KeyboardLayout";
import { Letter } from "../types/Letter";
import { LetterStatus } from "../types/Letter";
import FunctionKey from "./FunctionKey";
import LetterKey from "./LetterKey";

function Keyboard({
  layout,
  status,
  onLetter,
  onEnter,
  onBackspace,
}: {
  layout: KeyboardLayout;
  status: Record<Letter, LetterStatus>;
  onLetter: (letter: Letter) => void;
  onEnter: () => void;
  onBackspace: () => void;
}) {
  const widths = layout.map((row) =>
    row.reduce((sum, key) => sum + key.width, 0),
  );
  const maximumWidth = Math.max(...widths);

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${maximumWidth}, minmax(0, 1fr))` }}
    >
      {layout.map((row, rowIndex) => {
        return (
          <div
            key={rowIndex}
            className="grid gap-1.5 grid-cols-subgrid col-span-full"
            style={{
              gridColumnStart:
                Math.floor((maximumWidth - widths[rowIndex]) / 2) + 1,
            }}
          >
            {row.map((key, keyIndex) => {
              if (key.type === KeyboardLayoutKeyType.Letter) {
              }

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
        );
      })}
    </div>
  );
}

export default Keyboard;
