package com.xwtracker.solvedata;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.xwtracker.puzzle.Puzzle;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(indexes = {@Index(columnList = "solver_uid, puzzle_nyt_id", unique = true)})
public class SolveData {
    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    @JoinColumn(name = "solver_uid", nullable = false)
    @JsonIgnore
    private PuzzleTrackerUser solver;
    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "puzzle_id", referencedColumnName = "id"),
        @JoinColumn(name = "puzzle_nyt_id", referencedColumnName = "nyt_id")
    })
    private Puzzle puzzle;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Cell> cells = new ArrayList<>();
    private Integer time;
    private Date date;

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

    public Integer getTime() {
        return time;
    }

    public void setTime(Integer time) {
        this.time = time;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
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
