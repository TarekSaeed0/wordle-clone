import { HiOutlineBackspace } from "react-icons/hi";
import { KeyboardLayoutKey, KeyboardLayoutKeyType } from "../types/KeyboardLayout";
import { JSX } from "react";
import { LetterStatus } from "../types/Letter";

function KeyboardKey({ layoutKey, status }: { layoutKey: KeyboardLayoutKey; status: LetterStatus | null }) {
  const statusClasses: Map<LetterStatus | null, string> = new Map([
    ["correct", "bg-(--correct-color) text-(--key-evaluated-text-color) hover:bg-(--correct-color)/80 active:bg-(--correct-color)/60"],
    ["present", "bg-(--present-color) text-(--key-evaluated-text-color) hover:bg-(--present-color)/80 active:bg-(--present-color)/60"],
    ["absent", "bg-(--absent-color) text-(--key-evaluated-absent-text-color) hover:bg-(--absent-color)/80 active:bg-(--absent-color)/60"],
    ["unevaluated", "bg-(--key-bg-color) text-(--key-text-color) hover:bg-(--key-bg-color)/80 active:bg-(--key-bg-color)/60"],
    [null, "bg-(--key-bg-color) text-(--key-text-color) hover:bg-(--key-bg-color)/80 active:bg-(--key-bg-color)/60"]
  ]);
  
  let label: JSX.Element;
  switch (layoutKey.type) {
    case KeyboardLayoutKeyType.Letter:
      label = <span>{layoutKey.value}</span>;
      break;
    case KeyboardLayoutKeyType.Enter:
      label = <span className="text-xs">ENTER</span>;
      break;
    case KeyboardLayoutKeyType.Backspace:
      label = <HiOutlineBackspace size={22} />;
      break;
  }
  
  return (
    <button className={`px-3 py-6.5 rounded h-14 flex items-center justify-center text-xl font-semibold cursor-pointer transition-colors duration-100 ${statusClasses.get(status)}`} style={{ gridColumn: `span ${layoutKey.width}`}}>
      {label}
    </button>
  );
}

export default KeyboardKey;