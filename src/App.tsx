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
    "A": "correct",
    "B": "present",
    "C": "absent",
    "D": "correct",
    "E": "present",
  };

  let guesses: Guess[] = [
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
      { letter: "I", status: "unevaluated" },
      { letter: "J", status: "unevaluated" },
    ],
  ];

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-color)">
    <header className="flex-0 flex items-center justify-center px-4 py-2 font-bold mb-4 text-(--header-text-color) border-b border-(--header-border-color)">
      <h1 className="text-3xl">CSED Wordle</h1>
    </header>
    <main className="flex-1 flex flex-col items-center justify-center">
      <div className="w-fit mb-2.5">
        <Board wordLength={5} guessCount={6} guesses={guesses} />
      </div>
      <div className="w-fit">
        <Keyboard layout={language.keyboardLayout} status={status} />
      </div>
    </main>
    </div>
  );
}

export default App;
