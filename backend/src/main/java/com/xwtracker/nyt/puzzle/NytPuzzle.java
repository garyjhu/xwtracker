package com.xwtracker.nyt.puzzle;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.xwtracker.puzzle.Puzzle;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
@JsonDeserialize(using = NytPuzzleDeserializer.class)
public class NytPuzzle extends Puzzle {
    private String editor;
    private String publicationDate;
    @Column(length = 100000)
    private String svg;

    public String getEditor() {
        return editor;
    }

    public void setEditor(String editor) {
        this.editor = editor;
    }

    public String getPublicationDate() {
        return publicationDate;
    }

    public void setPublicationDate(String publicationDate) {
        this.publicationDate = publicationDate;
    }

    public String getSvg() {
        return svg;
    }

    public void setSvg(String svg) {
        this.svg = svg;
    }
}
