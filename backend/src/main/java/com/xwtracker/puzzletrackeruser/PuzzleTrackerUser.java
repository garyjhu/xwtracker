package com.xwtracker.puzzletrackeruser;

import com.xwtracker.login.ValidEmail;
import com.xwtracker.solvedata.SolveData;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.HashSet;

@Entity
public class PuzzleTrackerUser {
    @Id
    private String uid;
    @ElementCollection
    private Collection<GrantedAuthority> authorities = new HashSet<>();
    @ValidEmail
    @Column(nullable = false, unique = true)
    private String email;
    private String nytSCookie;
    @Column(nullable = false)
    private String password;
    @OneToMany
    private Collection<SolveData> solvedPuzzles = new HashSet<>();
    @Column(nullable = false, unique = true)
    private String username;

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public Collection<GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Collection<GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNytSCookie() {
        return nytSCookie;
    }

    public void setNytSCookie(String nytSCookie) {
        this.nytSCookie = nytSCookie;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Collection<SolveData> getSolvedPuzzles() {
        return solvedPuzzles;
    }

    public void setSolvedPuzzles(Collection<SolveData> solvedPuzzles) {
        this.solvedPuzzles = solvedPuzzles;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
