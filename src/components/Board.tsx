import { useLanguage } from "../hooks/useLanguage";
import Row from "./Row";
import type { Board } from "../types/game";

function Board({
  board,
  currentRow,
  rowShakeKey = 0,
}: {
  board: Board;
  currentRow: number;
  rowShakeKey?: number;
}) {
  const { direction } = useLanguage();

  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateRows: `repeat(${board.length}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${board[0]?.length ?? 0}, minmax(0, 1fr))`,
        direction,
      }}
    >
      {board.map((row, rowIndex) => (
        <Row
          key={
            rowIndex === currentRow ? `${rowIndex}-${rowShakeKey}` : rowIndex
          }
          row={row}
          className={`${
            rowIndex === currentRow && rowShakeKey !== 0 ? "animate-shake" : ""
          }`}
        />
      ))}
    </div>
  );
}

export default Board;
