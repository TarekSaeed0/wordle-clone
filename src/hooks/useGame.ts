import { useCallback, useReducer } from "react";
import { gameReducer, initializeGameState } from "../reducers/gameReducer";
import { Letter } from "../types/language";
import { GameActionType, GameOptions } from "../types/game";

export function useGame(options: GameOptions) {
  const [state, dispatch] = useReducer(
    gameReducer,
    options,
    initializeGameState,
  );

  const handleLetter = useCallback((letter: Letter) => {
    dispatch({ type: GameActionType.AddLetter, letter });
  }, []);

  const handleBackspace = useCallback(() => {
    dispatch({ type: GameActionType.RemoveLetter });
  }, []);

  const handleEnter = useCallback(() => {
    dispatch({ type: GameActionType.SubmitGuess });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: GameActionType.Reset });
  }, []);

  return {
    state,
    handleLetter,
    handleBackspace,
    handleEnter,
    handleReset,
  };
}
