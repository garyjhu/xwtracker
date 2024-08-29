package com.xwtracker.nyt.solvedata;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.xwtracker.solvedata.SolveData;
import jakarta.persistence.Entity;

@Entity
@JsonDeserialize(using = NytSolveDataDeserializer.class)
public class NytSolveData extends SolveData {
    private Boolean eligible;
    private Boolean solved;

    public Boolean getEligible() {
        return eligible;
    }

    public Boolean getSolved() {
        return solved;
    }

    public void setSolved(Boolean solved) {
        this.solved = solved;
    }

    public void setEligible(Boolean eligible) {
        this.eligible = eligible;
    }

    @Entity
    public static class Cell extends SolveData.Cell {
        private Integer timestamp;

        public Integer getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Integer timestamp) {
            this.timestamp = timestamp;
        }
    }
}
