package com.xwtracker.puzzletrackeruser;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PuzzleTrackerUserRepository extends JpaRepository<PuzzleTrackerUser, String> {
    PuzzleTrackerUser findByUsername(String username);
}
