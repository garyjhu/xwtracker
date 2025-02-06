package com.xwtracker.puzzle;

import jakarta.persistence.*;

@Entity
@Table(indexes = {@Index(columnList = "nyt_id"), @Index(columnList = "nyt_print_date")})
public class Puzzle {
    @Id
    @GeneratedValue
    private Long id;
    @Column(name = "nyt_id")
    private Long nytId;
    private Integer height;
    private Integer width;
    private String constructors;
    private String nytPrintDate;
    private String title;

    public Long getId() {
        return id;
    }

    public Long getNytId() {
        return nytId;
    }

    public void setNytId(Long nytId) {
        this.nytId = nytId;
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
}