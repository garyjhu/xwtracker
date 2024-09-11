package com.xwtracker.nyt;

import com.xwtracker.nyt.puzzle.NytPuzzle;
import com.xwtracker.nyt.service.NytService;
import com.xwtracker.nyt.service.archiveresults.NytArchiveResultsService;
import com.xwtracker.nyt.solvedata.NytSolveData;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
public class NytController {
    private final PuzzleTrackerUserRepository userRepository;
    private final NytService nytService;
    private final NytArchiveResultsService archiveResultsService;

    public NytController(PuzzleTrackerUserRepository userRepository, NytService nytService, NytArchiveResultsService archiveResultsService) {
        this.userRepository = userRepository;
        this.nytService = nytService;
        this.archiveResultsService = archiveResultsService;
    }

    @PostMapping(value = "/nyt", params = {"dateStart", "dateEnd"})
    public ResponseEntity<Void> updateNytPuzzlesAndSolveData(
        @RequestParam Optional<String> publishType,
        @RequestParam String dateStart,
        @RequestParam String dateEnd,
        Principal principal
    ) {
        nytService.validateStartAndEndDates(dateStart, dateEnd);
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        nytService.fetchArchiveResults(publishType.orElse("daily"), dateStart, dateEnd, user)
            .thenCompose(archiveResults -> archiveResultsService.updateNytPuzzlesAndSolveData(archiveResults, user))
            .join();
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/nyt", params = {"date"})
    public CompletableFuture<NytPuzzle> fetchPuzzleFromArchive(
        @RequestParam Optional<String> publishType,
        @RequestParam String date,
        Principal principal
    ) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        return nytService.fetchPuzzleFromArchive(publishType.orElse("daily"), date, user);
    }

    @GetMapping(value = "/nyt", params = {"puzzleID"})
    public CompletableFuture<NytSolveData> fetchSolveDataFromArchive(
        @RequestParam Long puzzleID,
        Principal principal
    ) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        return nytService.fetchSolveDataFromArchive(puzzleID, user);
    }
}
