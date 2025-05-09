package com.xwtracker.solvedata;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import com.xwtracker.solvegroup.SolveGroup;
import com.xwtracker.solvegroup.SolveGroupRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Date;
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

    @GetMapping(value = "/solvedata", params = {"puzzle_id"})
    public ResponseEntity<SolveData> fetchSolveData(Principal principal, @RequestParam(name = "puzzle_id") Long puzzleId) {
        Optional<SolveData> solveData = solveDataRepository.findById(new SolveDataId(puzzleId, principal.getName()));
        return ResponseEntity.of(solveData);
    }

    @GetMapping(value = "/solvedata")
    public ResponseEntity<PagedModel<SolveData>> fetchSolveData(
        Principal principal,
        @RequestParam("group") Optional<List<String>> groupNames,
        @RequestParam("date_start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Optional<Date> dateStart,
        @RequestParam("date_end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Optional<Date> dateEnd,
        Pageable pageable
    ) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        boolean useDateRange = dateStart.isPresent() || dateEnd.isPresent();
        Date start = dateStart.orElse(new Date(0));
        Date end = dateEnd.orElse(new Date());
        if (groupNames.isEmpty()) {
            Page<SolveData> page = useDateRange
                ? solveDataRepository.findByUserAndDateBetween(user, start, end, pageable)
                : solveDataRepository.findByUser(user, pageable);
            return ResponseEntity.ok(new PagedModel<>(page));
        }
        else {
            List<SolveGroup> groups = groupNames.get().stream()
                .map(groupName -> solveGroupRepository.findByNameAndUser(groupName, user))
                .toList();
            Page<SolveData> page = useDateRange
                ? solveDataRepository.findByGroupsAndDateBetween(groups, start, end, pageable)
                : solveDataRepository.findByGroups(groups, pageable);
            return ResponseEntity.ok(new PagedModel<>(page));
        }
    }

    @GetMapping(value = "/solvedata/summary")
    public ResponseEntity<List<SolveDataSummary>> fetchSolveDataByGroup(Principal principal, @RequestParam("group") Optional<List<String>> groupNames, Sort sort) {
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

    @DeleteMapping(value = "/solvedata")
    public ResponseEntity<Void> deleteSolveData(Principal principal, @RequestParam(name = "puzzle_id") Long puzzleId) {
        Optional<SolveData> solveData = solveDataRepository.findById(new SolveDataId(puzzleId, principal.getName()));
        if (solveData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        else {
            solveDataRepository.delete(solveData.get());
            return ResponseEntity.noContent().build();
        }
    }
}
