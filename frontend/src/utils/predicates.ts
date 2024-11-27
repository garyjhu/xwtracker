import { NytPuzzle, Puzzle } from "./types";

export function isNyt(puzzle: Puzzle): puzzle is NytPuzzle {
  return (puzzle as NytPuzzle).nytId !== undefined
}