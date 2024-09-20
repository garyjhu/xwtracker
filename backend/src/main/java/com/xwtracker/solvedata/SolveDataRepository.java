package com.xwtracker.solvedata;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.solvegroup.SolveGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SolveDataRepository extends JpaRepository<SolveData, Long> {
    SolveData findByUserAndPuzzleId(PuzzleTrackerUser user, Long id);

    SolveData findByUserAndPuzzleNytId(PuzzleTrackerUser user, Long nytId);

    SolveData findByUserAndPuzzleNytPrintDate(PuzzleTrackerUser user, String nytPrintDate);

    Page<SolveData> findByUser(PuzzleTrackerUser user, Pageable pageable);

    List<SolveDataSummary> findSolveDataByGroupsContaining(SolveGroup group);
}
