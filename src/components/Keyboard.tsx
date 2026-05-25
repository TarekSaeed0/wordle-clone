import { KeyboardLayout, KeyboardLayoutKeyType } from "../types/KeyboardLayout";
import { Letter } from "../types/Letter";
import { LetterStatus } from "../types/Letter";
import KeyboardKey from "./KeyboardKey";

function Keyboard({ layout, status }: { layout: KeyboardLayout; status: Record<Letter, LetterStatus> }) {
  const widths = layout.map((row) => row.reduce((sum, key) => sum + key.width, 0));
  const maximumWidth = Math.max(...widths);

  return (
    <div className="grid gap-2"  style={{ gridTemplateColumns: `repeat(${maximumWidth}, minmax(0, 1fr))` }}>
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="grid gap-1.5 grid-cols-subgrid col-span-full" style={{ gridColumnStart: Math.floor((maximumWidth - widths[rowIndex]) / 2) + 1 }}>
          {row.map((key, keyIndex) => <KeyboardKey key={keyIndex} layoutKey={key} status={key.type === KeyboardLayoutKeyType.Letter ? status[key.value] ?? "unevaluated" : null} />)}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
