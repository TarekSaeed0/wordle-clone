import { useCallback, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { English } from "./data/English";
import { Guess } from "./types/Guess";
import { Letter } from "./types/Letter";
import { LetterStatus } from "./types/Letter";

function App() {
  const language = English;
  let status: Record<Letter, LetterStatus> = {
    A: "correct",
    B: "present",
    C: "absent",
    D: "correct",
    E: "present",
  };

  const wordLength = 5;
  const guessCount = 6;

  const [guesses, setGuesses] = useState<Guess[]>([
    [
      { letter: "A", status: "correct" },
      { letter: "B", status: "present" },
      { letter: "C", status: "absent" },
      { letter: "D", status: "correct" },
      { letter: "E", status: "present" },
    ],
    [
      { letter: "F", status: "unevaluated" },
      { letter: "G", status: "unevaluated" },
      { letter: "H", status: "unevaluated" },
    ],
  ]);

  const handleLetter = useCallback((letter: Letter) => {
    setGuesses((guesses) => {
      if (guesses.length === wordLength) {
        return guesses;
      }

      const currentGuess = guesses[guesses.length - 1];
      return [
        ...guesses.slice(0, -1),
        [...currentGuess, { letter, status: "unevaluated" }],
      ];
    });
  }, []);

  const handleEnter = useCallback(() => {
    console.log("Enter");
  }, []);

  const handleBackspace = useCallback(() => {
    setGuesses((guesses) => {
      if (guesses.length === 0) {
        return guesses;
      }

      const currentGuess = guesses[guesses.length - 1];
      return [...guesses.slice(0, -1), currentGuess.slice(0, -1)];
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-color)">
      <header className="flex-0 flex items-center justify-center px-4 py-2 font-bold mb-4 text-(--header-text-color) border-b border-(--header-border-color)">
        <h1 className="text-3xl">CSED Wordle</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-fit mb-2.5">
          <Board
            wordLength={wordLength}
            guessCount={guessCount}
            guesses={guesses}
          />
        </div>
        <div className="w-fit">
          <Keyboard
            layout={language.keyboardLayout}
            status={status}
            onLetter={handleLetter}
            onEnter={handleEnter}
            onBackspace={handleBackspace}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
