package com.xwtracker.solvedata;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class SolveDataController {
    private final PuzzleTrackerUserRepository userRepository;
    private final SolveDataRepository solveDataRepository;

    public SolveDataController(PuzzleTrackerUserRepository userRepository, SolveDataRepository solveDataRepository) {
        this.userRepository = userRepository;
        this.solveDataRepository = solveDataRepository;
    }

    @GetMapping(value = "/api/solvedata", params = {"id"})
    public ResponseEntity<SolveData> getSolveData(Principal principal, @RequestParam Long id) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        SolveData solveData = solveDataRepository.findByUserAndId(user, id);
        return ResponseEntity.ofNullable(solveData);
    }

    @GetMapping(value = "/api/solvedata")
    public ResponseEntity<Page<SolveData>> getSolveDataList(Principal principal, Pageable pageable) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        Page<SolveData> page = solveDataRepository.findByUser(user, pageable);
        return ResponseEntity.ok(page);
    }
}
