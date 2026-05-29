import { useEffect } from "react";
import { Letter } from "../types/language";

export function useKeyboardInput(
  onLetter: (letter: Letter) => void,
  onBackspace: () => void,
  onEnter: () => void,
) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        onEnter();
      } else if (event.key === "Backspace") {
        onBackspace();
      } else {
        onLetter(event.key);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onBackspace, onEnter, onLetter]);
}
