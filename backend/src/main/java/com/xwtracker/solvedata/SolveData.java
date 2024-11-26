package com.xwtracker.solvedata;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.xwtracker.solvegroup.SolveGroup;
import com.xwtracker.puzzle.Puzzle;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import jakarta.persistence.*;

import java.util.*;

@Entity
@IdClass(SolveDataId.class)
public class SolveData {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_uid", nullable = false)
    @JsonIgnore
    private PuzzleTrackerUser user;
    @Id
    @ManyToOne
    @JoinColumn(name = "puzzle_id", nullable = false)
    private Puzzle puzzle;
    @ManyToMany
    private Collection<SolveGroup> groups = new HashSet<>();
    @ManyToOne
    private SolveGroup defaultGroup;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Cell> cells = new ArrayList<>();
    private Integer time;
    private Date date;

    public PuzzleTrackerUser getUser() {
        return user;
    }

    public void setUser(PuzzleTrackerUser user) {
        this.user = user;
    }

    public Puzzle getPuzzle() {
        return puzzle;
    }

    public void setPuzzle(Puzzle puzzle) {
        this.puzzle = puzzle;
    }

    public Collection<SolveGroup> getGroups() {
        return groups;
    }

    public void setGroups(Collection<SolveGroup> groups) {
        this.groups = groups;
    }

    public SolveGroup getDefaultGroup() {
        return defaultGroup;
    }

    public void setDefaultGroup(SolveGroup defaultGroup) {
        this.defaultGroup = defaultGroup;
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

    public String getTitle() {
        return puzzle.getTitle();
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
