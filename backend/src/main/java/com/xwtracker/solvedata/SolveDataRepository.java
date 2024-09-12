package com.xwtracker.solvedata;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "solveData", path = "solveData")
public interface SolveDataRepository extends JpaRepository<SolveData, Long> {
    SolveData findBySolverAndId(PuzzleTrackerUser solver, Long id);

    // use native query instead of JPA named query to avoid unnecessary join
    @Query(value = "SELECT * FROM SOLVE_DATA WHERE SOLVER_UID = ?1 AND PUZZLE_NYT_ID = ?2", nativeQuery = true)
    SolveData findBySolverAndNytPuzzleId(String uid, Long nytId);

    Page<SolveData> findBySolver(PuzzleTrackerUser solver, Pageable pageable);
}
