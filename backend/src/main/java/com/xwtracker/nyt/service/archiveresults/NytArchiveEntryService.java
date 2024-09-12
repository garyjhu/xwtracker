package com.xwtracker.nyt.service.archiveresults;

import com.xwtracker.nyt.puzzle.NytPuzzle;
import com.xwtracker.nyt.service.NytService;
import com.xwtracker.nyt.solvedata.NytSolveData;
import com.xwtracker.puzzle.Puzzle;
import com.xwtracker.puzzle.PuzzleRepository;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.solvedata.SolveData;
import com.xwtracker.solvedata.SolveDataRepository;
import org.springframework.stereotype.Service;

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
        return getNytPuzzle(archiveEntry, user)
            .thenAcceptBoth(getNytSolveData(archiveEntry, user), ((nytPuzzle, nytSolveData) -> {
                if (puzzleRepository.findByNytId(archiveEntry.getPuzzleID()) == null) {
                    nytPuzzle = puzzleRepository.save(nytPuzzle);
                }
                if (solveDataRepository.findBySolverAndNytPuzzleId(user.getUid(), archiveEntry.getPuzzleID()) == null) {
                    nytSolveData.setSolver(user);
                    nytSolveData.setPuzzle(nytPuzzle);
                    solveDataRepository.save(nytSolveData);
                }
            }));
    }

    private CompletableFuture<NytPuzzle> getNytPuzzle(NytArchiveEntry archiveEntry, PuzzleTrackerUser user) {
        Puzzle searchResult = puzzleRepository.findByNytId(archiveEntry.getPuzzleID());
        return searchResult == null
            ? nytService.fetchPuzzleFromArchive(archiveEntry.getPublishType(), archiveEntry.getPrintDate(), user)
            : CompletableFuture.completedFuture((NytPuzzle) searchResult);
    }

    private CompletableFuture<NytSolveData> getNytSolveData(NytArchiveEntry archiveEntry, PuzzleTrackerUser user) {
        SolveData searchResult = solveDataRepository.findBySolverAndNytPuzzleId(user.getUid(), archiveEntry.getPuzzleID());
        return searchResult == null
            ? nytService.fetchSolveDataFromArchive(archiveEntry.getPuzzleID(), user)
            : CompletableFuture.completedFuture((NytSolveData) searchResult);
    }
}
