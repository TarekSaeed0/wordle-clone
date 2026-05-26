import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import LanguageContext from "./context/LanguageContext";
import { Guess } from "./types/Guess";
import { Letter, LetterStatus } from "./types/Letter";
import { English } from "./data/English";

function App() {
  const language = English;

  const wordLength = 5;
  const guessCount = 6;

  const [guesses, setGuesses] = useState<Guess[]>([[]]);

  let status = useMemo(() => {
    const status: Record<string, LetterStatus> = {};

    for (const guess of guesses) {
      for (const { letter, status: letterStatus } of guess) {
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
  }, [guesses]);

  const handleLetter = useCallback((letter: Letter) => {
    setGuesses((guesses) => {
      if (guesses.length === wordLength) {
        return guesses;
      }

      const currentGuess = guesses[guesses.length - 1];
      return [
        ...guesses.slice(0, -1),
        [...currentGuess, { letter, status: LetterStatus.Unevaluated }],
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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        handleEnter();
      } else if (event.key === "Backspace") {
        handleBackspace();
      } else {
        const normalizedKey = language.normalization?.[event.key] || event.key;
        if (language.letters.includes(normalizedKey)) {
          handleLetter(normalizedKey);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-color)">
      <header className="flex-0 flex items-center justify-center px-4 py-2 font-bold mb-4 text-(--header-text-color) border-b border-(--header-border-color)">
        <h1 className="text-3xl">Wordle</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-2">
        <LanguageContext value={language}>
          <div className="w-fit mb-2.5">
            <Board
              wordLength={wordLength}
              guessCount={guessCount}
              guesses={guesses}
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
        </LanguageContext>
      </main>
    </div>
  );
}

export default App;
