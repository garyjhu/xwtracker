package com.xwtracker.nyt.puzzle;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

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
        deserializeBody(node.get("body").get(0), nytPuzzle);
        nytPuzzle.setConstructors(node.get("constructors").get(0).asText());
        nytPuzzle.setEditor(node.get("editor").asText());
        nytPuzzle.setNytId(node.get("id").asLong());
        nytPuzzle.setNytPrintDate(node.get("publicationDate").asText());
        if (node.get("title") != null) {
            nytPuzzle.setTitle(node.get("title").asText());
        }
        return nytPuzzle;
    }

    private void deserializeBody(JsonNode bodyNode, NytPuzzle nytPuzzle) {
        nytPuzzle.setSvg(bodyNode.get("board").asText());
        deserializeDimensions(bodyNode.get("dimensions"), nytPuzzle);
    }

    private void deserializeDimensions(JsonNode dimensionsNode, NytPuzzle nytPuzzle) {
        nytPuzzle.setHeight(dimensionsNode.get("height").asInt());
        nytPuzzle.setWidth(dimensionsNode.get("width").asInt());
    }
}
