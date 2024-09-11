package com.xwtracker.puzzle;

import com.xwtracker.puzzle.Puzzle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import java.util.List;

public interface PuzzleRepository extends JpaRepository<Puzzle, Long> {
    Puzzle findByNytPuzzleId(@NonNull Long nytPuzzleId);
}
