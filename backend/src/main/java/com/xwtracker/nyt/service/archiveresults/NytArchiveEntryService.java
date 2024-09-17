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

    public CompletableFuture<Void> updateNytPuzzleAndSolveData(NytArchiveEntry archiveEntry, PuzzleTrackerUser user) {
        return getNytPuzzle(archiveEntry, user)
            .thenAcceptBoth(getNytSolveData(archiveEntry, user), ((nytPuzzle, nytSolveData) -> {
                if (puzzleRepository.findByNytId(archiveEntry.getPuzzleID()) == null) {
                    nytPuzzle = puzzleRepository.save(nytPuzzle);
                }
                if (solveDataRepository.findByUserAndNytPuzzleId(user.getUid(), archiveEntry.getPuzzleID()) == null) {
                    nytSolveData.setUser(user);
                    nytSolveData.setPuzzle(nytPuzzle);
                    SolveGroup nytSolveGroup = solveGroupService.getNytSolveGroupFromPrintDate(archiveEntry.getPrintDate(), user);
                    nytSolveData.getGroups().add(nytSolveGroup);
                    nytSolveData.setDefaultGroup(nytSolveGroup);
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
        SolveData searchResult = solveDataRepository.findByUserAndNytPuzzleId(user.getUid(), archiveEntry.getPuzzleID());
        return searchResult == null
            ? nytService.fetchSolveDataFromArchive(archiveEntry.getPuzzleID(), user)
            : CompletableFuture.completedFuture((NytSolveData) searchResult);
    }
}
