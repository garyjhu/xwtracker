package com.xwtracker.solvedata;

import java.util.Date;

public interface SolveDataSummary {
    PuzzleId getPuzzle();
    Date getDate();
    Integer getTime();

    public interface PuzzleId {
        Long getId();
    }
}
