package com.xwtracker.solvedata;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import com.xwtracker.solvegroup.SolveGroup;
import com.xwtracker.solvegroup.SolveGroupRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

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

    @GetMapping(value = "/solvedata", params = {"id"})
    public ResponseEntity<SolveData> getSolveData(@RequestParam Long id) {
        Optional<SolveData> solveData = solveDataRepository.findById(id);
        return ResponseEntity.of(solveData);
    }

    @GetMapping(value = "/solvedata", params = {"puzzle_id"})
    public ResponseEntity<SolveData> getSolveData(Principal principal, @RequestParam(name = "puzzle_id") Long puzzleId) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        SolveData solveData = solveDataRepository.findByUserAndPuzzleId(user, puzzleId);
        return ResponseEntity.ofNullable(solveData);
    }

    @GetMapping(value = "/solvedata")
    public ResponseEntity<Page<SolveData>> getSolveData(Principal principal, @RequestParam("group") Optional<List<String>> groupNames, Pageable pageable) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        if (groupNames.isEmpty()) {
            Page<SolveData> page = solveDataRepository.findByUser(user, pageable);
            return ResponseEntity.ok(page);
        }
        else {
            List<SolveGroup> groups = groupNames.get().stream()
                .map(groupName -> solveGroupRepository.findByNameAndUser(groupName, user))
                .toList();
            Page<SolveData> page = solveDataRepository.findByGroups(groups, pageable);
            return ResponseEntity.ok(page);
        }
    }

    @GetMapping(value = "/solvedata/summary")
    public ResponseEntity<List<SolveDataSummary>> getSolveDataByGroup(Principal principal, @RequestParam("group") Optional<List<String>> groupNames, Sort sort) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        if (groupNames.isEmpty()) {
            List<SolveDataSummary> list = solveDataRepository.findSummaryByUser(user, sort);
            return ResponseEntity.ok(list);
        }
        else {
            List<SolveGroup> groups = groupNames.get().stream()
                .map(groupName -> solveGroupRepository.findByNameAndUser(groupName, user))
                .toList();
            List<SolveDataSummary> list = solveDataRepository.findSummaryByGroups(groups, sort);
            return ResponseEntity.ok(list);
        }
    }
}
