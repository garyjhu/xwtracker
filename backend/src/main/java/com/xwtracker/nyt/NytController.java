package com.xwtracker.nyt;

import com.xwtracker.nyt.puzzle.NytPuzzle;
import com.xwtracker.nyt.solvedata.NytSolveData;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
public class NytController {
    private final PuzzleTrackerUserRepository userRepository;
    private final NytService nytService;

    public NytController(PuzzleTrackerUserRepository userRepository, NytService nytService) {
        this.userRepository = userRepository;
        this.nytService = nytService;
    }

    @GetMapping(value = "/nyt", params = {"dateStart", "dateEnd"})
    public CompletableFuture<List<Long>> fetchPuzzleIDsFromArchive(@RequestParam Optional<String> publishType,
                                                                   @RequestParam LocalDateTime dateStart,
                                                                   @RequestParam LocalDateTime dateEnd,
                                                                   Principal principal) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        return nytService.fetchPuzzleIDsFromArchive(publishType.orElse("daily"), dateStart, dateEnd, user.getNytSCookie());
    }

    @GetMapping(value = "/nyt", params = {"date"})
    public CompletableFuture<NytPuzzle> fetchPuzzleFromArchive(@RequestParam Optional<String> publishType,
                                                               @RequestParam String date,
                                                               Principal principal) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        return nytService.fetchPuzzleFromArchive(publishType.orElse("daily"), date, user.getNytSCookie());
    }

    @GetMapping(value = "/nyt", params = {"puzzleID"})
    public CompletableFuture<NytSolveData> fetchSolveDataFromArchive(@RequestParam Long puzzleID,
                                                                     Principal principal) {
        PuzzleTrackerUser user = userRepository.getReferenceById(principal.getName());
        return nytService.fetchSolveDataFromArchive(puzzleID, user.getNytSCookie());
    }
}
