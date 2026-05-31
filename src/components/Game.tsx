import { useEffect, useMemo } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { LanguageProvider } from "../providers/LanguageProvider";
import { languageFromJson } from "../utils/languageFromJson";
import { GameOptions, GameStatus, LetterStatus } from "../types/game";
import { useGame } from "../hooks/useGame";
import english from "../data/languages/english.json";
import { useToast } from "../hooks/useToast";

const options: GameOptions = {
  language: languageFromJson(english),
  wordLength: 5,
  maximumGuesses: 6,
};

function Game() {
  const { state, handleLetter, handleBackspace, handleEnter } =
    useGame(options);

  useKeyboardInput(handleLetter, handleBackspace, handleEnter);

  const { showToast } = useToast();

  const status = useMemo(() => {
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

  useEffect(() => {
    if (state.invalidGuessCount > 0) {
      showToast({
        message:
          state.currentTile < state.board[state.currentRow].length
            ? "Not enough letters"
            : "Not in word list",
      });
    }
  }, [state.invalidGuessCount]);

  useEffect(() => {
    if (state.status === GameStatus.Won) {
      const message = [
        "Genius",
        "Magnificent",
        "Impressive",
        "Splendid",
        "Great",
        "Phew",
      ];

      const messageIndex =
        Math.floor((state.currentRow / state.board.length) * message.length) -
        1;

      showToast({
        message: message[messageIndex],
        duration: 5000,
      });
    } else if (state.status === GameStatus.Lost) {
      showToast({
        message: `${state.answer.join("").toUpperCase()}`,
        duration: 5000,
      });
    }
  }, [state.status]);

  return (
    <main className="flex-1 min-h-0 p-2 flex flex-col items-center justify-end gap-4">
      <LanguageProvider language={state.language}>
        <div className="flex-1 w-full min-h-0">
          <Board
            board={state.board}
            currentRow={state.currentRow}
            rowShakeKey={state.invalidGuessCount}
          />
        </div>
        <Keyboard
          status={status}
          onLetter={handleLetter}
          onEnter={handleEnter}
          onBackspace={handleBackspace}
        />
      </LanguageProvider>
    </main>
  );
}

export default Game;
