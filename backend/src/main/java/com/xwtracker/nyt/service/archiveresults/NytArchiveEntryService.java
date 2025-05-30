package com.xwtracker.nyt.service.archiveresults;

import com.xwtracker.nyt.puzzle.NytPuzzle;
import com.xwtracker.nyt.service.NytService;
import com.xwtracker.nyt.solvedata.NytSolveData;
import com.xwtracker.puzzle.Puzzle;
import com.xwtracker.puzzle.PuzzleRepository;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.solvedata.SolveData;
import com.xwtracker.solvedata.SolveDataRepository;
import com.xwtracker.solvegroup.SolveGroup;
import com.xwtracker.solvegroup.SolveGroupService;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class NytArchiveEntryService {
    private final NytService nytService;
    private final PuzzleRepository puzzleRepository;
    private final SolveDataRepository solveDataRepository;
    private final SolveGroupService solveGroupService;

    public NytArchiveEntryService(
        NytService nytService,
        PuzzleRepository puzzleRepository,
        SolveDataRepository solveDataRepository,
        SolveGroupService solveGroupService
    ) {
        this.nytService = nytService;
        this.puzzleRepository = puzzleRepository;
        this.solveDataRepository = solveDataRepository;
        this.solveGroupService = solveGroupService;
    }

    public CompletableFuture<NytSolveData> updateNytPuzzleAndSolveData(NytArchiveEntry archiveEntry, PuzzleTrackerUser user) {
        CompletableFuture<NytPuzzle> nytPuzzleFuture = getNytPuzzle(archiveEntry, user);
        CompletableFuture<NytSolveData> nytSolveDataFuture = getNytSolveData(archiveEntry, user);
        return nytSolveDataFuture
            .thenApply(nytSolveData -> {
                NytPuzzle nytPuzzle = nytPuzzleFuture.join();
                if (solveDataRepository.findByUserAndPuzzleNytId(user, archiveEntry.getPuzzleID()) == null) {
                    nytSolveData.setUser(user);
                    nytSolveData.setPuzzle(nytPuzzle);
                    SolveGroup nytSolveGroup = solveGroupService.getNytSolveGroupFromPrintDate(archiveEntry.getPrintDate(), user);
                    nytSolveData.getGroups().add(nytSolveGroup);
                    nytSolveData.setDefaultGroup(nytSolveGroup);
                    return nytSolveData;
                }
                else return null;
            });
    }

    private CompletableFuture<NytPuzzle> getNytPuzzle(NytArchiveEntry archiveEntry, PuzzleTrackerUser user) {
        Puzzle searchResult = puzzleRepository.findByNytId(archiveEntry.getPuzzleID());
        return searchResult == null
            ? nytService.fetchPuzzleFromArchive(archiveEntry.getPublishType(), archiveEntry.getPrintDate(), user.getCookie())
            : CompletableFuture.completedFuture((NytPuzzle) searchResult);
    }

    private CompletableFuture<NytSolveData> getNytSolveData(NytArchiveEntry archiveEntry, PuzzleTrackerUser user) {
        SolveData searchResult = solveDataRepository.findByUserAndPuzzleNytId(user, archiveEntry.getPuzzleID());
        return searchResult == null
            ? nytService.fetchSolveDataFromArchive(archiveEntry.getPuzzleID(), user.getCookie())
            : CompletableFuture.completedFuture((NytSolveData) searchResult);
    }
}
