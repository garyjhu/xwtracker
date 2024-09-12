package com.xwtracker.puzzle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

public interface PuzzleRepository extends JpaRepository<Puzzle, Long> {
    Puzzle findByNytId(@NonNull Long nytId);
}
