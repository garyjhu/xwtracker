package com.xwtracker.puzzletrackeruser;

import com.xwtracker.solvegroup.SolveGroup;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class PuzzleTrackerUser {
    @Id
    private String uid;
    private String nytSCookie;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SolveGroup> solveGroups = new ArrayList<>();

    public PuzzleTrackerUser() {}

    public PuzzleTrackerUser(String uid) {
        this.uid = uid;
    }

    public String getUid() {
        return uid;
    }

    public String getNytSCookie() {
        return nytSCookie;
    }

    public void setNytSCookie(String nytSCookie) {
        this.nytSCookie = nytSCookie;
    }

    public List<SolveGroup> getSolveGroups() {
        return solveGroups;
    }

    public void setSolveGroups(List<SolveGroup> solveGroups) {
        this.solveGroups = solveGroups;
    }
}
