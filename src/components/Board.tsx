import { useMemo, useRef } from "react";
import { useLanguage } from "../hooks/useLanguage";
import Row from "./Row";
import type { Board } from "../types/game";
import { useSize } from "../hooks/useSize";

/**
 * Calculates the available size, which is a smooth function that transitions from the full size to a percentage of the size as the size .
 *
 * @param size - The current size of the container (width or height).
 * @param percentage - The percentage of the size to transition to as the size increases.
 * @param transitionPoint - The size at which the transition should occur.
 * @param smoothness - The smoothness of the size transition at the transition point.
 * @returns The calculated available size.
 */
function calculateAvailableSize(
  size: number,
  percentage: number,
  transitionPoint: number,
  smoothness: number,
) {
  const t = 1 / (1 + Math.exp(-(size - transitionPoint) / smoothness));

  return size * (1 + (percentage - 1) * t);
}

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

  const rowCount = board.length;
  const columnCount = board[0].length;

  const gap = 5;

  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef);

  const availableSize = useMemo(() => {
    const percentage = 0.7;
    const transitionPoint = 450;
    const smoothness = 50;

    return {
      width: calculateAvailableSize(
        containerSize.width,
        percentage,
        transitionPoint,
        smoothness,
      ),
      height: calculateAvailableSize(
        containerSize.height,
        percentage,
        transitionPoint,
        smoothness,
      ),
    };
  }, [containerSize]);

  const boardSize = useMemo(() => {
    const tileWidth =
      (availableSize.width - (columnCount - 1) * gap) / columnCount;
    const tileHeight = (availableSize.height - (rowCount - 1) * gap) / rowCount;

    const tileSize = Math.min(tileWidth, tileHeight);

    return {
      width: columnCount * tileSize + (columnCount - 1) * gap,
      height: rowCount * tileSize + (rowCount - 1) * gap,
    };
  }, [availableSize, columnCount, rowCount]);

  return (
    <div
      ref={containerRef}
      className="flex size-full items-center justify-center"
    >
      <div
        className="grid"
        style={{
          width: `${boardSize.width}px`,
          height: `${boardSize.height}px`,
          gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          gap: `${gap}px`,
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
              rowIndex === currentRow && rowShakeKey !== 0
                ? "animate-shake"
                : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
