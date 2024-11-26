package com.xwtracker.nyt.solvedata;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import com.xwtracker.solvedata.SolveData;
import com.xwtracker.solvedata.SolveDataRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class NytSolveDataController {
    private final PuzzleTrackerUserRepository userRepository;
    private final SolveDataRepository solveDataRepository;

    public NytSolveDataController(PuzzleTrackerUserRepository userRepository, SolveDataRepository solveDataRepository) {
        this.userRepository = userRepository;
        this.solveDataRepository = solveDataRepository;
    }

    @GetMapping(value = "/nyt/solvedata", params = "print_date")
    public ResponseEntity<SolveData> fetchSolveData(Principal principal, @RequestParam(name = "print_date") String printDate) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        SolveData solveData = solveDataRepository.findByUserAndPuzzleNytPrintDate(user, printDate);
        return ResponseEntity.ofNullable(solveData);
    }

    @DeleteMapping(value = "/nyt/solvedata", params = "print_date")
    public ResponseEntity<Void> deleteSolveData(Principal principal, @RequestParam(name = "print_date") String printDate) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        SolveData solveData = solveDataRepository.findByUserAndPuzzleNytPrintDate(user, printDate);
        if (solveData == null) {
            return ResponseEntity.notFound().build();
        }
        else {
            solveDataRepository.delete(solveData);
            return ResponseEntity.noContent().build();
        }
    }
}
