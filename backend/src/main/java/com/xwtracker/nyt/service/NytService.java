package com.xwtracker.nyt.service;

import com.xwtracker.nyt.puzzle.NytPuzzle;
import com.xwtracker.nyt.service.archiveresults.NytArchiveResults;
import com.xwtracker.nyt.solvedata.NytSolveData;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.concurrent.CompletableFuture;

@Service
public class NytService {
    private final RestClient restClient;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public NytService(RestClient restClient) {
        this.restClient = restClient;
    }

    @Bean
    public static RestClient restClient(RestClient.Builder restClientBuilder) {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
        return restClientBuilder
            .baseUrl("https://www.nytimes.com/svc/crosswords/")
            .messageConverters(converters -> converters.add(converter))
            .build();
    }

    public void validateStartAndEndDates(String dateStart, String dateEnd) throws DateTimeException {
        if (LocalDate.parse(dateStart, formatter).isAfter(LocalDate.parse(dateEnd, formatter))) {
            throw new InvalidDateRangeException();
        }
    }

    @Async
    public CompletableFuture<NytArchiveResults> fetchArchiveResults(
        String publishType,
        String dateStart,
        String dateEnd,
        PuzzleTrackerUser user
    ) {
        ResponseEntity<NytArchiveResults> response = restClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("v3/puzzles.json")
                .queryParam("publish_type", publishType)
                .queryParam("sort_order", "asc")
                .queryParam("sort_by", "print_date")
                .queryParam("date_start", dateStart)
                .queryParam("date_end", dateEnd)
                .build())
            .header("Cookie", "NYT-S=" + user.getNytSCookie())
            .retrieve()
            .toEntity(NytArchiveResults.class);
        return CompletableFuture.completedFuture(response.getBody());
    }

    @Async
    public CompletableFuture<NytPuzzle> fetchPuzzleFromArchive(
        String publishType,
        String date,
        PuzzleTrackerUser user
    ) {
        ResponseEntity<NytPuzzle> response = restClient.get()
            .uri("v6/puzzle/" + publishType + "/" + date + ".json")
            .header("Cookie", "NYT-S=" + user.getNytSCookie())
            .retrieve()
            .toEntity(NytPuzzle.class);
        return CompletableFuture.completedFuture(response.getBody());
    }

    @Async
    public CompletableFuture<NytSolveData> fetchSolveDataFromArchive(
        Long puzzleID,
        PuzzleTrackerUser user
    ) {
        ResponseEntity<NytSolveData> response = restClient.get()
            .uri("v6/game/" + puzzleID + ".json")
            .header("Cookie", "NYT-S=" + user.getNytSCookie())
            .retrieve()
            .toEntity(NytSolveData.class);
        return CompletableFuture.completedFuture(response.getBody());
    }
}

