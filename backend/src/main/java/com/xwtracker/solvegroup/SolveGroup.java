package com.xwtracker.solvegroup;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import jakarta.persistence.*;

@Entity
@IdClass(SolveGroupId.class)
public class SolveGroup {
    @Id
    private String name;
    @Id
    @ManyToOne
    @JoinColumn(name = "solver_uid", nullable = false)
    @JsonIgnore
    private PuzzleTrackerUser user;

    public SolveGroup() {}

    public SolveGroup(String name, PuzzleTrackerUser user) {
        this.name = name;
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public PuzzleTrackerUser getUser() {
        return user;
    }
}
