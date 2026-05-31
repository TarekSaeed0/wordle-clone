import Tile from "./Tile";
import type { Row } from "../types/game";

function Row({ row, className = "" }: { row: Row; className?: string }) {
  return (
    <div className={`grid grid-cols-subgrid col-span-full ${className}`}>
      {row.map((tile, tileIndex) => (
        <Tile key={tileIndex} tile={tile} />
      ))}
    </div>
  );
}

export default Row;
