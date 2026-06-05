import { motion } from "motion/react";
import { LetterStatus } from "../types/game";
import type { Tile } from "../types/game";
import { useEffect, useState } from "react";

const STATUS_CLASSES: Record<LetterStatus, string> = {
  [LetterStatus.Correct]:
    "bg-(--correct-color) border-(--correct-color) text-(--key-evaluated-text-color)",
  [LetterStatus.Present]:
    "bg-(--present-color) border-(--present-color) text-(--key-evaluated-text-color)",
  [LetterStatus.Absent]:
    "bg-(--absent-color) border-(--absent-color) text-(--key-evaluated-absent-text-color)",
  [LetterStatus.Unevaluated]:
    "border-(--tile-unevaluated-border-color) text-(--key-text-color)",
  [LetterStatus.Empty]:
    "border-(--tile-empty-border-color) text-(--key-text-color)",
};
const REVEAL_DURATION = 0.4;
const REVEAL_DELAY = 0.4;

function Tile({ tile, index }: { tile: Tile; index: number }) {
  const shouldReveal =
    tile.status !== LetterStatus.Empty &&
    tile.status !== LetterStatus.Unevaluated;

  const [status, setStatus] = useState(tile.status);
  useEffect(() => {
    if (shouldReveal) {
      const timeout = setTimeout(
        () => {
          setStatus(tile.status);
        },
        (index * REVEAL_DELAY + REVEAL_DURATION / 2) * 1000,
      );

      return () => {
        clearTimeout(timeout);
      };
    } else {
      setStatus(tile.status);
    }
  }, [tile.status]);

  return (
    <motion.div
      key={tile.status}
      className={`aspect-square border-2 flex items-center justify-center text-[2rem] font-bold uppercase select-none ${STATUS_CLASSES[status]}`}
      animate={shouldReveal ? { rotateX: [0, 90, 0] } : { rotateX: 0 }}
      transition={{
        duration: REVEAL_DURATION,
        delay: index * REVEAL_DELAY,
        ease: "linear",
      }}
    >
      {tile.letter}
    </motion.div>
  );
}

export default Tile;
