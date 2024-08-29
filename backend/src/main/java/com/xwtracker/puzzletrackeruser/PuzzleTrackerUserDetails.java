package com.xwtracker.puzzletrackeruser;

public class PuzzleTrackerUserDetails extends org.springframework.security.core.userdetails.User {
    public PuzzleTrackerUserDetails(PuzzleTrackerUser user) {
        super(user.getUsername(), user.getPassword(), user.getAuthorities());
    }
}
