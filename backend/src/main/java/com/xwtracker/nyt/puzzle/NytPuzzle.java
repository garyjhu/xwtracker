package com.xwtracker.nyt.puzzle;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.xwtracker.puzzle.Puzzle;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
@JsonDeserialize(using = NytPuzzleDeserializer.class)
public class NytPuzzle extends Puzzle {
    private String editor;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String svg;

    public String getEditor() {
        return editor;
    }

    public void setEditor(String editor) {
        this.editor = editor;
    }

    public String getSvg() {
        return svg;
    }

    public void setSvg(String svg) {
        this.svg = svg;
    }
}
