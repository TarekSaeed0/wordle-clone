import { useMemo } from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { useKeyboardInput } from "./hooks/useKeyboardInput";
import { LanguageProvider } from "./providers/LanguageProvider";
import { languageFromJson } from "./utils/languageFromJson";
import { GameOptions, LetterStatus } from "./types/game";
import { useGame } from "./hooks/useGame";
import english from "./data/languages/english.json";
import "./App.css";

const options: GameOptions = {
  language: languageFromJson(english),
  wordLength: 5,
  maximumGuesses: 6,
};

function App() {
  const { state, handleLetter, handleBackspace, handleEnter } =
    useGame(options);

  useKeyboardInput(handleLetter, handleBackspace, handleEnter);

  let status = useMemo(() => {
    const status: Record<string, LetterStatus> = {};

    for (const row of state.board) {
      for (const { letter, status: letterStatus } of row) {
        switch (letterStatus) {
          case LetterStatus.Correct:
            status[letter] = LetterStatus.Correct;
            break;
          case LetterStatus.Present:
            if (status[letter] !== LetterStatus.Correct) {
              status[letter] = LetterStatus.Present;
            }
            break;
          case LetterStatus.Absent:
            if (!status[letter]) {
              status[letter] = LetterStatus.Absent;
            }
            break;
        }
      }
    }

    return status;
  }, [state.board]);

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-color)">
      <header className="flex-0 flex items-center justify-center px-4 py-2 font-bold mb-4 text-(--header-text-color) border-b border-(--header-border-color)">
        <h1 className="text-3xl">Wordle</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-2">
        <LanguageProvider language={state.language}>
          <div className="w-fit mb-2.5">
            <Board
              board={state.board}
              currentRow={state.currentRow}
              rowShakeKey={state.invalidGuessCount}
            />
          </div>
          <div className="w-fit">
            <Keyboard
              status={status}
              onLetter={handleLetter}
              onEnter={handleEnter}
              onBackspace={handleBackspace}
            />
          </div>
        </LanguageProvider>
      </main>
    </div>
  );
}

export default App;
