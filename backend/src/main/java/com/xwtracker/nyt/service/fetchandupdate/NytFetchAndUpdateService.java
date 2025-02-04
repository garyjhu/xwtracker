package com.xwtracker.nyt.service.fetchandupdate;

import com.xwtracker.nyt.puzzle.NytPuzzle;
import com.xwtracker.nyt.service.NytService;
import com.xwtracker.nyt.service.archiveresults.NytArchiveResultsService;
import com.xwtracker.nyt.solvedata.NytSolveData;
import com.xwtracker.puzzle.PuzzleRepository;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.function.Predicate;

@Service
public class NytFetchAndUpdateService {
    private final NytService nytService;
    private final NytArchiveResultsService archiveResultsService;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private final LocalDate FIRST_NYT_PUBLISH_DATE = LocalDate.of(2022, 11, 21);
    private final PuzzleRepository puzzleRepository;

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
            fetchAndUpdateBlock(job.getPublishType(), blockStart.format(formatter), blockEnd.format(formatter), user);
        }
    }

    public void fetchAndUpdateBlock(
        String publishType,
        String dateStart,
        String dateEnd,
        PuzzleTrackerUser user
    ) {
        nytService.fetchArchiveResults(publishType, dateStart, dateEnd, user.getCookie())
            .thenApply(archiveResults -> archiveResultsService.fetchNytPuzzlesAndSolveData(archiveResults, user))
            .thenAccept(futures -> CompletableFuture.allOf(futures.toArray(CompletableFuture[]::new))
                .whenComplete((unused, throwable) -> {
                    List<NytSolveData> nytSolveDataList = futures.stream()
                        .filter(future -> !future.isCompletedExceptionally())
                        .map(CompletableFuture::join)
                        .filter(Predicate.not(Objects::isNull))
                        .toList();
                    List<NytPuzzle> nytPuzzleList = nytSolveDataList.stream()
                        .map(nytSolveData -> (NytPuzzle) nytSolveData.getPuzzle())
                        .filter(nytPuzzle -> puzzleRepository.findByNytId(nytPuzzle.getNytId()) == null)
                        .toList();
                    archiveResultsService.updateNytPuzzlesAndSolveData(nytPuzzleList, nytSolveDataList, user.getUid());
                })
                .join()
            )
            .join();
    }
}
