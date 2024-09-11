package com.xwtracker.nyt.service.archiveresults;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class NytArchiveResultsService {
    public final NytArchiveEntryService archiveEntryService;

    public NytArchiveResultsService(NytArchiveEntryService archiveEntryService) {
        this.archiveEntryService = archiveEntryService;
    }

    public CompletableFuture<Void> updateNytPuzzlesAndSolveData(NytArchiveResults archiveResults, PuzzleTrackerUser user) {
        return CompletableFuture.allOf(archiveResults
            .getResults()
            .stream()
            .filter(NytArchiveEntry::isSolved)
            .map(archiveEntry -> archiveEntryService.updateNytPuzzleAndSolveData(archiveEntry, user))
            .toArray(CompletableFuture[]::new)
        );
    }
}
