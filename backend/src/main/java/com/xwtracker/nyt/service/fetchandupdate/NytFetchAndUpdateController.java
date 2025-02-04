package com.xwtracker.nyt.service.fetchandupdate;

import com.xwtracker.nyt.service.NytService;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
public class NytFetchAndUpdateController {
    private final PuzzleTrackerUserRepository userRepository;
    private final NytFetchAndUpdateJobRepository jobRepository;
    private final NytFetchAndUpdateService fetchAndUpdateService;
    private final NytService nytService;

    public NytFetchAndUpdateController(
        PuzzleTrackerUserRepository userRepository,
        NytFetchAndUpdateJobRepository jobRepository,
        NytFetchAndUpdateService fetchAndUpdateService,
        NytService nytService
    ) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.fetchAndUpdateService = fetchAndUpdateService;
        this.nytService = nytService;
    }

    @PutMapping(value = "/nyt", params = {"dateStart", "dateEnd"})
    public ResponseEntity<Void> createJob(
        @RequestParam Optional<String> publishType,
        @RequestParam String dateStart,
        @RequestParam String dateEnd,
        Principal principal
    ) {
        nytService.validateStartAndEndDates(dateStart, dateEnd);

        String uid = principal.getName();
        PuzzleTrackerUser user = userRepository.findUserAndCookieByUid(uid);

        NytFetchAndUpdateJob job = new NytFetchAndUpdateJob();
        job.setUser(user);
        job.setPublishType(publishType.orElse("daily"));
        fetchAndUpdateService.parseDates(job, dateStart, dateEnd);
        jobRepository.deleteById(uid);
        jobRepository.save(job);

        fetchAndUpdateService.executeFetchAndUpdateJob(job, user);
        return ResponseEntity.accepted().build();
    }

    @GetMapping(value = "/nyt")
    public ResponseEntity<NytFetchAndUpdateJob> getJobStatus(Principal principal) {
        Optional<NytFetchAndUpdateJob> job = jobRepository.findById(principal.getName());
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }

    @DeleteMapping(value = "/nyt")
    public ResponseEntity<Void> removeJob(Principal principal) {
        String uid = principal.getName();
        if (jobRepository.existsById(uid)) {
            jobRepository.deleteById(uid);
            return ResponseEntity.noContent().build();
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }
}
