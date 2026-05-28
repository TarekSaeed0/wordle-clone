import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import LanguageContext from "./context/LanguageContext";
import languageFromJson from "./utils/languageFromJson";
import english from "./data/english.json";
import { LetterStatus, Guess } from "./types/game";
import { Letter } from "./types/language";
import evaluateGuess from "./utils/evaluateGuess";

function App() {
  const language = useMemo(() => languageFromJson(english), []);
  const [wordLength] = useState(5);
  const [guessCount] = useState(6);
  const [guesses, setGuesses] = useState<Guess[]>([[]]);

  const handleLetter = useCallback(
    (letter: Letter) => {
      setGuesses((guesses) => {
        const currentGuess = guesses[guesses.length - 1];
        if (currentGuess.length === wordLength) {
          return guesses;
        }

        return [
          ...guesses.slice(0, -1),
          [...currentGuess, { letter, status: LetterStatus.Unevaluated }],
        ];
      });
    },
    [guesses, wordLength],
  );

  const dictionary = useMemo(
    () =>
      new Set(language.dictionary.filter((word) => word.length === wordLength)),
    [language, wordLength],
  );

  const target = useMemo(
    () => [...dictionary][Math.floor(Math.random() * dictionary.size)],
    [dictionary],
  );
  console.log(target);

  const [invalidGuessKey, setInvalidGuessKey] = useState(0);

  const handleEnter = useCallback(() => {
    const currentGuess = guesses[guesses.length - 1];
    if (currentGuess.length !== wordLength) {
      setInvalidGuessKey((key) => key + 1);
      return;
    }

    const word = currentGuess.map(({ letter }) => letter).join("");
    if (!dictionary.has(word)) {
      setInvalidGuessKey((key) => key + 1);
      return;
    }

    const statuses = evaluateGuess(
      currentGuess.map(({ letter }) => letter),
      target.split(""),
    );

    setInvalidGuessKey(0);

    if (guesses.length === guessCount) {
      setGuesses((guesses) => [
        ...guesses.slice(0, -1),
        currentGuess.map(({ letter }, index) => ({
          letter,
          status: statuses[index],
        })),
      ]);
    } else {
      setGuesses((guesses) => [
        ...guesses.slice(0, -1),
        currentGuess.map(({ letter }, index) => ({
          letter,
          status: statuses[index],
        })),
        [],
      ]);
    }
  }, [guesses, wordLength, dictionary, target]);

  const handleBackspace = useCallback(() => {
    setGuesses((guesses) => {
      const currentGuess = guesses[guesses.length - 1];
      if (currentGuess.length === 0) {
        return guesses;
      }

      return [...guesses.slice(0, -1), currentGuess.slice(0, -1)];
    });
  }, [guesses]);

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
  }, [handleEnter, handleBackspace, handleLetter, language]);

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
              invalidGuessKey={invalidGuessKey}
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
