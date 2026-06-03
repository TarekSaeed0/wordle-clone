import { useCallback, useEffect, useMemo, useRef } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { LanguageProvider } from "../providers/LanguageProvider";
import { languageFromJson } from "../utils/languageFromJson";
import { GameOptions, GameStatus, LetterStatus } from "../types/game";
import { useGame } from "../hooks/useGame";
import english from "../data/languages/english.json";
import { useToast } from "../hooks/useToast";
import { exit } from "@tauri-apps/plugin-process";
import { useSize } from "../hooks/useSize";

const options: GameOptions = {
  language: languageFromJson(english),
  wordLength: 5,
  maximumGuesses: 6,
};

function Game() {
  const { state, handleLetter, handleBackspace, handleEnter, handleReset } =
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

  const handleQuit = useCallback(() => {
    exit(0);
  }, []);

  const keyboardRef = useRef(null);
  const keyboardSize = useSize(keyboardRef);

  return (
    <div className="size-full flex flex-col items-center justify-end gap-4">
      <LanguageProvider language={state.language}>
        <div className="flex-1 w-full min-h-0">
          <Board
            board={state.board}
            currentRow={state.currentRow}
            rowShakeKey={state.invalidGuessCount}
          />
        </div>
        {state.status === GameStatus.Playing ? (
          <div ref={keyboardRef}>
            <Keyboard
              status={status}
              onLetter={handleLetter}
              onEnter={handleEnter}
              onBackspace={handleBackspace}
            />
          </div>
        ) : (
          <div
            className="flex items-start justify-center gap-3 "
            style={{
              width: keyboardSize.width,
              height: keyboardSize.height,
            }}
          >
            <button
              className="px-6 py-3 rounded-full flex items-center justify-center font-semibold cursor-pointer transition-colors duration-100 bg-(--correct-color) text-(--key-evaluated-text-color) hover:bg-(--correct-color)/80 active:bg-(--correct-color)/60 select-none"
              onClick={handleReset}
            >
              Play Again
            </button>
            <button
              className="px-6 py-3 rounded-full flex items-center justify-center font-semibold cursor-pointer transition-colors duration-100 text-(--text-color) border border-(--border-color) hover:bg-(--text-color)/15 active:bg-(--text-color)/30 select-none"
              onClick={handleQuit}
            >
              Quit
            </button>
          </div>
        )}
      </LanguageProvider>
    </div>
  );
}

export default Game;
