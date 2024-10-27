package com.xwtracker.puzzletrackeruser;

import com.xwtracker.solvegroup.SolveGroup;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class PuzzleTrackerUserController {
    private final PuzzleTrackerUserRepository userRepository;

    public PuzzleTrackerUserController(PuzzleTrackerUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/user/cookie")
    public ResponseEntity<Void> setNytSCookie(Principal principal, @RequestBody String nytSCookie) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        user.setNytSCookie(nytSCookie);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/groups")
    public ResponseEntity<List<SolveGroup>> fetchSolveGroups(Principal principal) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        return ResponseEntity.ok(user.getSolveGroups());
    }
}
