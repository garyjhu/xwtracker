package com.xwtracker.nyt.solvedata;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "nytSolveData", path = "nytSolveData")
public interface NytSolveDataRepository extends JpaRepository<NytSolveData, Long> {
}
