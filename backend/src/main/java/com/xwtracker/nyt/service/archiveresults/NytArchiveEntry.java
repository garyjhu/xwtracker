package com.xwtracker.nyt.service.archiveresults;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Locale;

public class NytArchiveEntry {
    @JsonProperty("print_date")
    private String printDate;
    @JsonProperty("publish_type")
    private String publishType;
    @JsonProperty("puzzle_id")
    private Long puzzleID;
    private Boolean solved;

    public String getPrintDate() {
        return printDate;
    }

    public void setPrintDate(String printDate) {
        this.printDate = printDate;
    }

    public String getPublishType() {
        return publishType;
    }

    public void setPublishType(String publishType) {
        this.publishType = publishType.toLowerCase(Locale.ROOT);
    }

    public Long getPuzzleID() {
        return puzzleID;
    }

    public void setPuzzleID(Long puzzleID) {
        this.puzzleID = puzzleID;
    }

    public Boolean isSolved() {
        return solved;
    }

    @JsonProperty("solved")
    public void setSolved(Boolean solved) {
        this.solved = solved;
    }
}
