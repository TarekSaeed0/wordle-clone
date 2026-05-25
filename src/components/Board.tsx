import { Guess } from "../types/Guess";
import Tile from "./Tile";

function Board({ wordLength, guessCount, guesses }: { wordLength: number; guessCount: number; guesses: Guess[] }) {
  return (
    <div className="grid gap-1" style={{ gridTemplateRows: `repeat(${guessCount}, minmax(0, 1fr))`, gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}>
      {Array.from({ length: guessCount }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-subgrid gap-1.5 col-span-full"
        >
          {Array.from({ length: wordLength }).map((_, j) => (
            <Tile key={j} letter={guesses[i]?.[j]?.letter ?? null} status={guesses[i]?.[j]?.status ?? null} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;