package com.xwtracker.solvedata;

import com.xwtracker.puzzle.Puzzle;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(indexes = {@Index(columnList = "solver_uid, puzzle_id", unique = true)})
public class SolveData {
    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    @JoinColumn(name = "solver_uid", nullable = false)
    private PuzzleTrackerUser solver;
    @ManyToOne
    @JoinColumn(name = "puzzle_id", nullable = false)
    private Puzzle puzzle;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Cell> cells = new ArrayList<>();
    private Integer secondsSpentSolving;
    private Date timeOfSolve;

    public PuzzleTrackerUser getSolver() {
        return solver;
    }

    public void setSolver(PuzzleTrackerUser solver) {
        this.solver = solver;
    }

    public Puzzle getPuzzle() {
        return puzzle;
    }

    public void setPuzzle(Puzzle puzzle) {
        this.puzzle = puzzle;
    }

    public List<? extends Cell> getCells() {
        return cells;
    }

    @SuppressWarnings("unchecked")
    public void setCells(List<? extends Cell> cells) {
        this.cells = (List<Cell>) cells;
    }

    public Integer getSecondsSpentSolving() {
        return secondsSpentSolving;
    }

    public void setSecondsSpentSolving(Integer secondsSpentSolving) {
        this.secondsSpentSolving = secondsSpentSolving;
    }

    public Date getTimeOfSolve() {
        return timeOfSolve;
    }

    public void setTimeOfSolve(Date timeOfSolve) {
        this.timeOfSolve = timeOfSolve;
    }

    @Entity
    public static class Cell {
        @Id
        @GeneratedValue
        private Long id;
        private Boolean blank;
        private String guess;

        public Boolean getBlank() {
            return blank;
        }

        public void setBlank(Boolean blank) {
            this.blank = blank;
        }

        public String getGuess() {
            return guess;
        }

        public void setGuess(String guess) {
            this.guess = guess;
        }

    }
}
