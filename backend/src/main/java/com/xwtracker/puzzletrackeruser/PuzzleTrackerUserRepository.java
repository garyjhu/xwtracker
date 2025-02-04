package com.xwtracker.puzzletrackeruser;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PuzzleTrackerUserRepository extends JpaRepository<PuzzleTrackerUser, String> {
    @EntityGraph(attributePaths = "cookie")
    PuzzleTrackerUser findUserAndCookieByUid(String uid);
}
