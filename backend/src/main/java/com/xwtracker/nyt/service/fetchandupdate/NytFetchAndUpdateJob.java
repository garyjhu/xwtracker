package com.xwtracker.nyt.service.fetchandupdate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class NytFetchAndUpdateJob {
    @Id
    private String uid;
    @OneToOne
    @MapsId
    @JsonIgnore
    private PuzzleTrackerUser user;
    @JsonProperty("isComplete")
    private Boolean isComplete = false;
    private Integer puzzlesFetched = 0;
    private Integer blocksRemaining;
    private String publishType;
    private LocalDate dateStart;
    private LocalDate dateEnd;

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public PuzzleTrackerUser getUser() {
        return user;
    }

    public void setUser(PuzzleTrackerUser user) {
        this.user = user;
    }

    public Boolean getComplete() {
        return isComplete;
    }

    public void setComplete(Boolean complete) {
        isComplete = complete;
    }

    public Integer getPuzzlesFetched() {
        return puzzlesFetched;
    }

    public void setPuzzlesFetched(Integer puzzlesFetched) {
        this.puzzlesFetched = puzzlesFetched;
    }

    public Integer getBlocksRemaining() {
        return blocksRemaining;
    }

    public void setBlocksRemaining(Integer blocksRemaining) {
        this.blocksRemaining = blocksRemaining;
    }

    public String getPublishType() {
        return publishType;
    }

    public void setPublishType(String publishType) {
        this.publishType = publishType;
    }

    public LocalDate getDateStart() {
        return dateStart;
    }

    public void setDateStart(LocalDate dateStart) {
        this.dateStart = dateStart;
    }

    public LocalDate getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(LocalDate dateEnd) {
        this.dateEnd = dateEnd;
    }
}
