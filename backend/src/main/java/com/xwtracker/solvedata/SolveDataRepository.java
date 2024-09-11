package com.xwtracker.solvedata;

import com.xwtracker.puzzle.Puzzle;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "solveData", path = "solveData")
public interface SolveDataRepository extends JpaRepository<SolveData, Long> {
    SolveData findBySolverAndId(PuzzleTrackerUser solver, Long id);

    SolveData findBySolverAndPuzzle(PuzzleTrackerUser solver, Puzzle puzzle);

    Page<SolveData> findBySolver(PuzzleTrackerUser solver, Pageable pageable);
}
