package com.xwtracker.puzzletrackeruser;

import com.xwtracker.solvedata.SolveData;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.HashSet;

@Entity
public class PuzzleTrackerUser {
    @Id
    private String uid;
    private String nytSCookie;
    @OneToMany(mappedBy = "solver")
    private Collection<SolveData> solvedPuzzles = new HashSet<>();

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getNytSCookie() {
        return nytSCookie;
    }

    public void setNytSCookie(String nytSCookie) {
        this.nytSCookie = nytSCookie;
    }

    public Collection<SolveData> getSolvedPuzzles() {
        return solvedPuzzles;
    }

    public void setSolvedPuzzles(Collection<SolveData> solvedPuzzles) {
        this.solvedPuzzles = solvedPuzzles;
    }

}
