package com.xwtracker.solvedata;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import com.xwtracker.solvegroup.SolveGroup;
import com.xwtracker.solvegroup.SolveGroupRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
public class SolveDataController {
    private final PuzzleTrackerUserRepository userRepository;
    private final SolveDataRepository solveDataRepository;
    private final SolveGroupRepository solveGroupRepository;

    public SolveDataController(
        PuzzleTrackerUserRepository userRepository,
        SolveDataRepository solveDataRepository,
        SolveGroupRepository solveGroupRepository
    ) {
        this.userRepository = userRepository;
        this.solveDataRepository = solveDataRepository;
        this.solveGroupRepository = solveGroupRepository;
    }

    @GetMapping(value = "/solvedata", params = {"puzzle_id"})
    public ResponseEntity<SolveData> getSolveData(Principal principal, @RequestParam Long puzzleId) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        SolveData solveData = solveDataRepository.findByUserAndPuzzleId(user, puzzleId);
        return ResponseEntity.ofNullable(solveData);
    }

    @GetMapping(value = "/solvedata")
    public ResponseEntity<Page<SolveData>> getSolveData(Principal principal, Pageable pageable) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        Page<SolveData> page = solveDataRepository.findByUser(user, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping(value = "/solvedata", params = {"group"})
    public ResponseEntity<List<SolveDataSummary>> getSolveData(Principal principal, @RequestParam("group") String groupName) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        SolveGroup group = solveGroupRepository.findByNameAndUser(groupName, user);
        List<SolveDataSummary> list = solveDataRepository.findSolveDataByGroupsContaining(group);
        return ResponseEntity.ok(list);
    }
}
