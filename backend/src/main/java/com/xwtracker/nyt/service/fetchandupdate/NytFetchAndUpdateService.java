package com.xwtracker.nyt.service.fetchandupdate;

import com.xwtracker.nyt.puzzle.NytPuzzle;
import com.xwtracker.nyt.service.NytService;
import com.xwtracker.nyt.service.archiveresults.NytArchiveResults;
import com.xwtracker.nyt.service.archiveresults.NytArchiveResultsService;
import com.xwtracker.nyt.solvedata.NytSolveData;
import com.xwtracker.puzzle.PuzzleRepository;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;

@Service
public class NytFetchAndUpdateService {
    private final NytService nytService;
    private final NytArchiveResultsService archiveResultsService;
    private final PuzzleRepository puzzleRepository;
    private final Logger logger = LoggerFactory.getLogger(NytFetchAndUpdateService.class);

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private final LocalDate FIRST_NYT_PUBLISH_DATE = LocalDate.of(1993, 11, 21);

    public NytFetchAndUpdateService(
        NytService nytService,
        NytArchiveResultsService archiveResultsService,
        PuzzleRepository puzzleRepository) {
        this.nytService = nytService;
        this.archiveResultsService = archiveResultsService;
        this.puzzleRepository = puzzleRepository;
    }

    public void parseDates(NytFetchAndUpdateJob job, String dateStart, String dateEnd) {
        LocalDate dateStartParsed = LocalDate.parse(dateStart, formatter);
        LocalDate dateEndParsed = LocalDate.parse(dateEnd, formatter);
        if (dateStartParsed.isBefore(FIRST_NYT_PUBLISH_DATE)) dateStartParsed = FIRST_NYT_PUBLISH_DATE;
        if (dateEndParsed.isAfter(LocalDate.now().plusDays(1))) dateEndParsed = LocalDate.now().plusDays(1);
        job.setDateStart(dateStartParsed);
        job.setDateEnd(dateEndParsed);
        job.setBlocksRemaining((int) ChronoUnit.DAYS.between(dateStartParsed, dateEndParsed) / 100 + 1);
    }

    @Async
    public void executeFetchAndUpdateJob(NytFetchAndUpdateJob job, PuzzleTrackerUser user) {
        for (
            LocalDate blockEnd = job.getDateEnd();
            !blockEnd.isBefore(job.getDateStart());
            blockEnd = blockEnd.minusDays(100)
        ) {
            LocalDate blockStart = blockEnd.minusDays(99);
            if (blockStart.isBefore(job.getDateStart())) blockStart = job.getDateStart();
            fetchAndUpdateBlock(job, blockStart.format(formatter), blockEnd.format(formatter), user);
        }
    }

    public void fetchAndUpdateBlock(
        NytFetchAndUpdateJob job,
        String dateStart,
        String dateEnd,
        PuzzleTrackerUser user
    ) {
        try {
            NytArchiveResults archiveResults = nytService.fetchArchiveResults(job.getPublishType(), dateStart, dateEnd, user.getCookie()).get();
            List<CompletableFuture<NytSolveData>> futures = archiveResultsService.fetchNytPuzzlesAndSolveData(archiveResults, user);
            List<NytSolveData> nytSolveDataList = futures.stream()
                .map(future -> {
                    try {
                        return future.get();
                    }
                    catch (Exception e) {
                        logger.error(e.getLocalizedMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();
            List<NytPuzzle> nytPuzzleList = nytSolveDataList.stream()
                .map(nytSolveData -> (NytPuzzle) nytSolveData.getPuzzle())
                .filter(nytPuzzle -> puzzleRepository.findByNytId(nytPuzzle.getNytId()) == null)
                .toList();
            archiveResultsService.updateNytPuzzlesAndSolveData(nytPuzzleList, nytSolveDataList, job);
        }
        catch (Exception e) {
            logger.error(e.getLocalizedMessage());
        }
    }
}
