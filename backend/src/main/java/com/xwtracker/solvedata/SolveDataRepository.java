package com.xwtracker.solvedata;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "solveData", path = "solveData")
public interface SolveDataRepository extends JpaRepository<SolveData, Long> {
    SolveData findByUserAndId(PuzzleTrackerUser user, Long id);

    // use native query instead of JPA named query to avoid unnecessary join
    @Query(value = "SELECT * FROM SOLVE_DATA WHERE USER_UID = ?1 AND PUZZLE_NYT_ID = ?2", nativeQuery = true)
    SolveData findByUserAndNytPuzzleId(String uid, Long nytId);

    Page<SolveData> findByUser(PuzzleTrackerUser user, Pageable pageable);
}
