package com.xwtracker.puzzletrackeruser;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class PuzzleTrackerUserController {
    private final PuzzleTrackerUserRepository userRepository;

    public PuzzleTrackerUserController(PuzzleTrackerUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/cookie")
    public ResponseEntity<Void> setNytSCookie(Principal principal, @RequestParam String nytSCookie) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        user.setNytSCookie(nytSCookie);
        return ResponseEntity.ok().build();
    }
}
