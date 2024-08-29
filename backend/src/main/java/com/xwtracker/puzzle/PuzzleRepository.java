package com.xwtracker.puzzle;

import com.xwtracker.puzzle.Puzzle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PuzzleRepository extends JpaRepository<Puzzle, Long> {
}
