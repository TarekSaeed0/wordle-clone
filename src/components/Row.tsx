import Tile from "./Tile";
import type { Row } from "../types/game";

function Row({ row, className = "" }: { row: Row; className?: string }) {
  return (
    <div
      className={`grid grid-cols-subgrid gap-1.5 col-span-full ${className}`}
    >
      {row.map((tile, j) => (
        <Tile key={j} tile={tile} />
      ))}
    </div>
  );
}

export default Row;
