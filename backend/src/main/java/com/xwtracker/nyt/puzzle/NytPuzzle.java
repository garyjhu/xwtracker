package com.xwtracker.nyt.puzzle;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.xwtracker.puzzle.Puzzle;
import jakarta.persistence.Entity;

@Entity
@JsonDeserialize(using = NytPuzzleDeserializer.class)
public class NytPuzzle extends Puzzle {
    private String editor;
    private String publicationDate;

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
}
