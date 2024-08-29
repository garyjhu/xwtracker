package com.xwtracker.nyt.solvedata;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class NytSolveDataDeserializer extends StdDeserializer<NytSolveData> {
    public NytSolveDataDeserializer() { this(null); }

    public NytSolveDataDeserializer(Class<?> vc) {
        super(vc);
    }

    public NytSolveData deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        NytSolveData nytSolveData = new NytSolveData();
        JsonNode node = jp.readValueAsTree();
        deserializeCells(node.get("board").get("cells"), jp.getCodec(), nytSolveData);
        deserializeCalcs(node.get("calcs"), nytSolveData);
        nytSolveData.setTimeOfSolve(new Date(TimeUnit.SECONDS.toMillis(node.get("lastSolve").asLong())));
        return nytSolveData;
    }

    private void deserializeCells(JsonNode cellsNode, ObjectCodec codec, NytSolveData nytSolveData) throws IOException {
        try (JsonParser jp = cellsNode.traverse()) {
            jp.setCodec(codec);
            List<NytSolveData.Cell> cells = jp.readValueAs(new TypeReference<List<NytSolveData.Cell>>() { });
            nytSolveData.setCells(cells);
        }
    }

    private void deserializeCalcs(JsonNode calcsNode, NytSolveData nytSolveData) {
        nytSolveData.setSecondsSpentSolving(calcsNode.get("secondsSpentSolving").asInt());
        nytSolveData.setSolved(calcsNode.get("solved").asBoolean());
    }
}
