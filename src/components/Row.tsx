import Tile from "./Tile";
import type { Row } from "../types/game";
import { motion } from "motion/react";

function Row({ row, shakeKey = 0 }: { row: Row; shakeKey?: number }) {
  const shouldShake = shakeKey !== 0;

  return (
    <motion.div
      key={shakeKey}
      className={`grid grid-cols-subgrid col-span-full`}
      animate={
        shouldShake ? { x: [0, -1, 2, -4, 4, -4, 4, -4, 2, -1, 0] } : { x: 0 }
      }
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {row.map((tile, tileIndex) => (
        <Tile key={tileIndex} tile={tile} index={tileIndex} />
      ))}
    </motion.div>
  );
}

export default Row;
