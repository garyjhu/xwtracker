package com.xwtracker.nyt.service.fetchandupdate;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NytFetchAndUpdateJobRepository extends JpaRepository<NytFetchAndUpdateJob, String> {
}
