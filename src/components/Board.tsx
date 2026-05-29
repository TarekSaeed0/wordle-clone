import { useLanguage } from "../hooks/useLanguage";
import Row from "./Row";
import type { Board } from "../types/game";

function Board({
  board,
  invalidGuessKey = 0,
}: {
  board: Board;
  invalidGuessKey?: number;
}) {
  const { direction } = useLanguage();

  const currentGuessIndex = board.length - 1;

  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateRows: `repeat(${board.length}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${board[0]?.length ?? 0}, minmax(0, 1fr))`,
        direction,
      }}
    >
      {board.map((row, i) => (
        <Row
          key={i === currentGuessIndex ? `${i}-${invalidGuessKey}` : i}
          row={row}
          className={`${
            i === currentGuessIndex && invalidGuessKey !== 0
              ? "animate-shake"
              : ""
          }`}
        />
      ))}
    </div>
  );
}

export default Board;
