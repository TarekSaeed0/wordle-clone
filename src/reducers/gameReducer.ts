import {
  GameState,
  Board,
  LetterStatus,
  GameStatus,
  GameAction,
  GameActionType,
  GameOptions,
} from "../types/game";
import { Letter } from "../types/language";

export function initializeGameState(options: GameOptions): GameState {
  const board: Board = Array.from({ length: options.maximumGuesses }, () =>
    Array.from({ length: options.wordLength }, () => ({
      letter: "",
      status: LetterStatus.Unevaluated,
    })),
  );

  const dictionary = options.language.dictionary[options.wordLength];

  const answer =
    dictionary.answers[
      Math.floor(Math.random() * dictionary.answers.length)
    ].split("");

  console.log("Answer:", answer.join(""));

  return {
    language: options.language,
    board,
    currentRow: 0,
    currentTile: 0,
    status: GameStatus.Playing,
    answer,
    invalidGuessCount: 0,
  };
}

function addLetter(state: GameState, letter: Letter): GameState {
  if (state.status !== GameStatus.Playing) {
    return state;
  }

  if (state.currentTile >= state.board[state.currentRow].length) {
    return state;
  }

  letter = state.language.normalization?.[letter] || letter;

  if (!state.language.letters.includes(letter)) {
    return state;
  }

  const board = state.board.map((row, rowIndex) =>
    row.map((tile, tileIndex) => {
      if (rowIndex === state.currentRow && tileIndex === state.currentTile) {
        return { letter, status: LetterStatus.Unevaluated };
      }
      return tile;
    }),
  );

  return {
    ...state,
    board,
    currentTile: state.currentTile + 1,
  };
}

function removeLetter(state: GameState): GameState {
  if (state.status !== GameStatus.Playing) {
    return state;
  }

  if (state.currentTile === 0) {
    return state;
  }

  const board = state.board.map((row, rowIndex) =>
    row.map((tile, tileIndex) => {
      if (
        rowIndex === state.currentRow &&
        tileIndex === state.currentTile - 1
      ) {
        return { letter: "", status: LetterStatus.Unevaluated };
      }
      return tile;
    }),
  );

  return {
    ...state,
    board,
    currentTile: state.currentTile - 1,
  };
}

function validateGuess(state: GameState, guess: Letter[]): boolean {
  if (guess.some((letter) => letter === "")) {
    return false;
  }

  const dictionary = state.language.dictionary[guess.length];

  return dictionary.guesses.has(guess.join(""));
}

function evaluateGuess(state: GameState, guess: Letter[]): LetterStatus[] {
  const statuses: LetterStatus[] = Array.from(
    { length: guess.length },
    () => LetterStatus.Absent,
  );

  const answerLetterCount = state.answer.reduce(
    (count, letter) => {
      count[letter] = (count[letter] || 0) + 1;
      return count;
    },
    {} as Record<Letter, number>,
  );

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === state.answer[i]) {
      statuses[i] = LetterStatus.Correct;
      answerLetterCount[guess[i]]--;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (statuses[i] === LetterStatus.Correct) {
      continue;
    }

    if (answerLetterCount[guess[i]] > 0) {
      statuses[i] = LetterStatus.Present;
      answerLetterCount[guess[i]]--;
    }
  }

  return statuses;
}

function submitGuess(state: GameState): GameState {
  if (state.status !== GameStatus.Playing) {
    return state;
  }

  const guess = state.board[state.currentRow].map((tile) => tile.letter);

  if (!validateGuess(state, guess)) {
    return {
      ...state,
      invalidGuessCount: state.invalidGuessCount + 1,
    };
  }

  const statuses = evaluateGuess(state, guess);

  const board = state.board.map((row, rowIndex) =>
    row.map((tile, tileIndex) => {
      if (rowIndex === state.currentRow) {
        return { ...tile, status: statuses[tileIndex] };
      }
      return tile;
    }),
  );

  let status: GameStatus = GameStatus.Playing;
  if (statuses.every((status) => status === LetterStatus.Correct)) {
    status = GameStatus.Won;
  } else if (state.currentRow + 1 >= state.board.length) {
    status = GameStatus.Lost;
  }

  return {
    ...state,
    board,
    currentRow: state.currentRow + 1,
    currentTile: 0,
    status,
    invalidGuessCount: 0,
  };
}

function resetGame(state: GameState): GameState {
  return initializeGameState({
    language: state.language,
    wordLength: state.board[0].length,
    maximumGuesses: state.board.length,
  });
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case GameActionType.AddLetter:
      return addLetter(state, action.letter);
    case GameActionType.RemoveLetter:
      return removeLetter(state);
    case GameActionType.SubmitGuess:
      return submitGuess(state);
    case GameActionType.Reset:
      return resetGame(state);
    default:
      return state;
  }
}
