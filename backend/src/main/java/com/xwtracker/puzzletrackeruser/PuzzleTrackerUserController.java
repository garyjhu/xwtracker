package com.xwtracker.puzzletrackeruser;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
public class PuzzleTrackerUserController {
    private final PuzzleTrackerUserRepository userRepository;

    public PuzzleTrackerUserController(PuzzleTrackerUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/cookie")
    public ResponseEntity<Void> setNytSCookie(Principal principal, @RequestBody String nytSCookie) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        user.setNytSCookie(nytSCookie);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}
