package com.xwtracker.nyt.puzzle;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.List;

public class NytPuzzleDeserializer extends StdDeserializer<NytPuzzle> {
    public NytPuzzleDeserializer() {
        this(null);
    }

    public NytPuzzleDeserializer(Class<?> vc) {
        super(vc);
    }

    public NytPuzzle deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        JsonNode node = jp.readValueAsTree();
        NytPuzzle nytPuzzle = new NytPuzzle();
        deserializeBody(node.get("body").get(0), jp.getCodec(), nytPuzzle);
        nytPuzzle.setConstructors(node.get("constructors").get(0).asText());
        nytPuzzle.setEditor(node.get("editor").asText());
        nytPuzzle.setNytId(node.get("id").asLong());
        nytPuzzle.setPublicationDate(node.get("publicationDate").asText());
        if (node.get("title") != null) {
            nytPuzzle.setTitle(node.get("title").asText());
        }
        return nytPuzzle;
    }

    private void deserializeBody(JsonNode bodyNode, ObjectCodec codec, NytPuzzle nytPuzzle) throws IOException {
        nytPuzzle.setSvg(bodyNode.get("board").asText());
        deserializeCells(bodyNode.get("cells"), codec, nytPuzzle);
        for (JsonNode clueNode : bodyNode.get("clues")) {
            deserializeClue(clueNode, nytPuzzle);
        }
        deserializeDimensions(bodyNode.get("dimensions"), nytPuzzle);
    }

    private void deserializeCells(JsonNode cellsNode, ObjectCodec codec, NytPuzzle nytPuzzle) throws IOException {
        try (JsonParser jp = cellsNode.traverse()) {
            jp.setCodec(codec);
            List<NytPuzzle.Cell> cells = jp.readValueAs(new TypeReference<List<NytPuzzle.Cell>>() { });
            nytPuzzle.setCells(cells);
        }
    }

    private void deserializeClue(JsonNode clueNode, NytPuzzle nytPuzzle) {
        NytPuzzle.Clue clue = new NytPuzzle.Clue();
        for (JsonNode cellNode : clueNode.get("cells")) {
            NytPuzzle.Cell cell = nytPuzzle.getCells().get(cellNode.asInt());
            clue.getCells().add(cell);
            cell.getClues().add(clue);
        }
        clue.setDirection(clueNode.get("direction").asText());
        clue.setLabel(clueNode.get("label").asText());
        clue.setText(clueNode.get("text").get(0).get("plain").asText());
        nytPuzzle.getClues().add(clue);
    }

    private void deserializeDimensions(JsonNode dimensionsNode, NytPuzzle nytPuzzle) {
        nytPuzzle.setHeight(dimensionsNode.get("height").asInt());
        nytPuzzle.setWidth(dimensionsNode.get("width").asInt());
    }
}
