package com.xwtracker.puzzletrackeruser;

import com.xwtracker.solvegroup.SolveGroup;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class PuzzleTrackerUser {
    @Id
    private String uid;
    private String cookie;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SolveGroup> solveGroups = new ArrayList<>();

    public PuzzleTrackerUser() {}

    public PuzzleTrackerUser(String uid) {
        this.uid = uid;
    }

    public String getUid() {
        return uid;
    }

    public String getCookie() {
        return cookie;
    }

    public void setCookie(String cookie) {
        this.cookie = cookie;
    }

    public List<SolveGroup> getSolveGroups() {
        return solveGroups;
    }

    public void setSolveGroups(List<SolveGroup> solveGroups) {
        this.solveGroups = solveGroups;
    }
}
