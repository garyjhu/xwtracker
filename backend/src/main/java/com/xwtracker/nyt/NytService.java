package com.xwtracker.nyt;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.xwtracker.nyt.puzzle.NytPuzzle;
import com.xwtracker.nyt.solvedata.NytSolveData;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class NytService {
    private final RestClient restClient;
    private final String apiRoot = "https://www.nytimes.com/svc/crosswords/";
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public NytService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    @Async
    public CompletableFuture<List<Long>> fetchPuzzleIDsFromArchive(String publishType, LocalDateTime dateStart, LocalDateTime dateEnd, String nytSCookie) {
        ResponseEntity<ArchiveResults> response = restClient.get()
            .uri(uriBuilder -> uriBuilder
                .path(apiRoot + "v3/puzzles.json")
                .queryParam("publish_type", publishType)
                .queryParam("sort_order", "asc")
                .queryParam("sort_by", "print_date")
                .queryParam("date_start", formatter.format(dateStart))
                .queryParam("date_end", formatter.format(dateEnd))
                .build())
            .header("Cookie", "NYT-S=" + nytSCookie)
            .retrieve()
            .toEntity(ArchiveResults.class);
        List<Long> puzzleIDList = response.getBody() == null ? null : response.getBody()
            .getResults()
            .stream()
            .map(ArchiveResults.ArchiveEntry::getPuzzleID)
            .toList();
        return CompletableFuture.completedFuture(puzzleIDList);
    }

    @Async
    public CompletableFuture<NytPuzzle> fetchPuzzleFromArchive(String publishType, String date, String nytSCookie) {
        System.out.println(apiRoot + "v6/puzzle/" + publishType + "/" + date + ".json");
        ResponseEntity<NytPuzzle> response = restClient.get()
            .uri(apiRoot + "v6/puzzle/" + publishType + "/" + date + ".json")
            .header("Cookie", "NYT-S=" + nytSCookie)
            .retrieve()
            .toEntity(NytPuzzle.class);
        return CompletableFuture.completedFuture(response.getBody());
    }

    @Async
    public CompletableFuture<NytSolveData> fetchSolveDataFromArchive(Long puzzleID, String nytSCookie) {
        ResponseEntity<NytSolveData> response = restClient.get()
            .uri(apiRoot + "v6/game/" + puzzleID + ".json")
            .header("Cookie", "NYT-S=" + nytSCookie)
            .retrieve()
            .toEntity(NytSolveData.class);
        return CompletableFuture.completedFuture(response.getBody());
    }
}

class ArchiveResults {
    private List<ArchiveEntry> results;

    public List<ArchiveEntry> getResults() {
        return results;
    }

    public void setResults(List<ArchiveEntry> results) {
        this.results = results;
    }

    public static class ArchiveEntry {
        @JsonProperty("puzzle_id")
        private Long puzzleID;

        public Long getPuzzleID() {
            return puzzleID;
        }

        public void setPuzzleID(Long puzzleID) {
            this.puzzleID = puzzleID;
        }
    }
}

