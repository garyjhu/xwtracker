package com.xwtracker.nyt.solvedata;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.xwtracker.solvedata.SolveData;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
@JsonDeserialize(using = NytSolveDataDeserializer.class)
public class NytSolveData extends SolveData {
    private Boolean eligible;
    private Boolean solved;
    @JsonRawValue
    @Column(columnDefinition = "TEXT")
    private String cells;

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

    public String getCells() {
        return cells;
    }

    public void setCells(String cells) {
        this.cells = cells;
    }
}