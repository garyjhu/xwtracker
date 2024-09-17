package com.xwtracker.solvegroup;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolveGroupRepository extends JpaRepository<SolveGroup, SolveGroupId> {
    SolveGroup findByNameAndUser(String name, PuzzleTrackerUser user);
}
