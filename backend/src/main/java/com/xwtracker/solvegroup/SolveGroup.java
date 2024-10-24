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
    private String color;

    public SolveGroup() {}

    public SolveGroup(String name, PuzzleTrackerUser user, String color) {
        this.name = name;
        this.user = user;
        this.color = color;
    }

    public String getName() {
        return name;
    }

    public PuzzleTrackerUser getUser() {
        return user;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
