package com.xwtracker.nyt.solvedata;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class NytSolveDataDeserializer extends StdDeserializer<NytSolveData> {
    public NytSolveDataDeserializer() { this(null); }

    public NytSolveDataDeserializer(Class<?> vc) {
        super(vc);
    }

    public NytSolveData deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        NytSolveData nytSolveData = new NytSolveData();
        JsonNode node = jp.readValueAsTree();
        nytSolveData.setCells(node.get("board").get("cells").toString());
        deserializeCalcs(node.get("calcs"), nytSolveData);
        nytSolveData.setDate(new Date(TimeUnit.SECONDS.toMillis(node.get("lastSolve").asLong())));
        return nytSolveData;
    }

    private void deserializeCalcs(JsonNode calcsNode, NytSolveData nytSolveData) {
        nytSolveData.setTime(calcsNode.get("secondsSpentSolving").asInt());
        nytSolveData.setSolved(calcsNode.get("solved").asBoolean());
    }
}
