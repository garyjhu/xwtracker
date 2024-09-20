package com.xwtracker.puzzle;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

@Entity
@Table(indexes = {@Index(columnList = "nyt_id"), @Index(columnList = "nyt_print_date")})
public class Puzzle {
    @Id
    @GeneratedValue
    private Long id;
    @Column(name = "nyt_id")
    private Long nytId;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Cell> cells = new ArrayList<>();
    @OneToMany(cascade = CascadeType.ALL)
    private List<Clue> clues = new ArrayList<>();
    private Integer height;
    private Integer width;
    private String constructors;
    private String nytPrintDate;
    private String title;

    public Long getNytId() {
        return nytId;
    }

    public void setNytId(Long nytId) {
        this.nytId = nytId;
    }

    public List<Cell> getCells() {
        return cells;
    }

    public void setCells(List<Cell> cells) {
        this.cells = cells;
    }

    public List<Clue> getClues() {
        return clues;
    }

    public void setClues(List<Clue> clues) {
        this.clues = clues;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public String getConstructors() {
        return constructors;
    }

    public void setConstructors(String constructors) {
        this.constructors = constructors;
    }

    public String getNytPrintDate() {
        return nytPrintDate;
    }

    public void setNytPrintDate(String nytPrintDate) {
        this.nytPrintDate = nytPrintDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Entity
    public static class Cell {
        @Id
        @GeneratedValue
        private Long id;
        private String answer;
        @JsonIgnore
        @ManyToMany(mappedBy = "cells")
        private Collection<Clue> clues = new HashSet<>();
        private String label;

        public String getAnswer() {
            return answer;
        }

        public void setAnswer(String answer) {
            this.answer = answer;
        }

        public Collection<Clue> getClues() {
            return clues;
        }

        public void setClues(Collection<Clue> clues) {
            this.clues = clues;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }
    }

    @Entity
    public static class Clue {
        @Id
        @GeneratedValue
        private Long id;
        @JsonIgnore
        @ManyToMany
        private List<Cell> cells = new ArrayList<>();
        private String direction;
        private String label;
        private String text;

        public List<Cell> getCells() {
            return cells;
        }

        public void setCells(List<Cell> cells) {
            this.cells = cells;
        }

        public String getDirection() {
            return direction;
        }

        public void setDirection(String direction) {
            this.direction = direction;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}