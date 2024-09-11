package com.xwtracker.nyt.service.archiveresults;

import com.xwtracker.nyt.service.NytService;
import com.xwtracker.puzzle.Puzzle;
import com.xwtracker.puzzle.PuzzleRepository;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.solvedata.SolveDataRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.concurrent.CompletableFuture;

@Service
public class NytArchiveEntryService {
    private final NytService nytService;
    private final PuzzleRepository puzzleRepository;
    private final SolveDataRepository solveDataRepository;

    public NytArchiveEntryService(NytService nytService, PuzzleRepository puzzleRepository, SolveDataRepository solveDataRepository) {
        this.nytService = nytService;
        this.puzzleRepository = puzzleRepository;
        this.solveDataRepository = solveDataRepository;
    }

    public CompletableFuture<Void> updateNytPuzzleAndSolveData(NytArchiveEntry archiveEntry, PuzzleTrackerUser user) {
        return nytService.fetchPuzzleFromArchive(archiveEntry.getPublishType(), archiveEntry.getPrintDate(), user)
            .thenApply(nytPuzzle -> {
                Puzzle searchResult = puzzleRepository.findByNytPuzzleId(archiveEntry.getPuzzleID());
                return Objects.requireNonNullElse(searchResult, puzzleRepository.save(nytPuzzle));
            })
            .thenAcceptBoth(nytService.fetchSolveDataFromArchive(archiveEntry.getPuzzleID(), user), (nytPuzzle, nytSolveData) -> {
                if (solveDataRepository.findBySolverAndPuzzle(user, nytPuzzle) == null) {
                    nytSolveData.setSolver(user);
                    nytSolveData.setPuzzle(nytPuzzle);
                    solveDataRepository.save(nytSolveData);
                }
            });
    }
}
