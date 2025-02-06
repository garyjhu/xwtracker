package com.xwtracker.nyt.service.archiveresults;

import com.xwtracker.nyt.puzzle.NytPuzzle;
import com.xwtracker.nyt.service.fetchandupdate.NytFetchAndUpdateJob;
import com.xwtracker.nyt.service.fetchandupdate.NytFetchAndUpdateJobRepository;
import com.xwtracker.nyt.solvedata.NytSolveData;
import com.xwtracker.puzzle.PuzzleRepository;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.solvedata.SolveDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class NytArchiveResultsService {
    public final NytFetchAndUpdateJobRepository jobRepository;
    public final NytArchiveEntryService archiveEntryService;
    public final PuzzleRepository puzzleRepository;
    public final SolveDataRepository solveDataRepository;

    public NytArchiveResultsService(
        NytFetchAndUpdateJobRepository jobRepository,
        NytArchiveEntryService archiveEntryService,
        PuzzleRepository puzzleRepository,
        SolveDataRepository solveDataRepository
    ) {
        this.jobRepository = jobRepository;
        this.archiveEntryService = archiveEntryService;
        this.puzzleRepository = puzzleRepository;
        this.solveDataRepository = solveDataRepository;
    }

    public List<CompletableFuture<NytSolveData>> fetchNytPuzzlesAndSolveData(
        NytArchiveResults archiveResults,
        PuzzleTrackerUser user
    ) {
        return archiveResults.getResults().stream()
            .filter(NytArchiveEntry::isSolved)
            .map(archiveEntry -> archiveEntryService.updateNytPuzzleAndSolveData(archiveEntry, user))
            .toList();
    }

    @Transactional
    public void updateNytPuzzlesAndSolveData(
        List<NytPuzzle> nytPuzzleList,
        List<NytSolveData> nytSolveDataList,
        NytFetchAndUpdateJob job
    ) {
        puzzleRepository.saveAll(nytPuzzleList);
        solveDataRepository.saveAll(nytSolveDataList);
        job.setPuzzlesFetched(job.getPuzzlesFetched() + nytSolveDataList.size());
        job.setBlocksRemaining(job.getBlocksRemaining() - 1);
        if (job.getBlocksRemaining() == 0) {
            job.setComplete(true);
        }
        jobRepository.save(job);
    }
}
