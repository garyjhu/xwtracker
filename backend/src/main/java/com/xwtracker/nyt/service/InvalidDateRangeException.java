package com.xwtracker.nyt.service;

import java.time.DateTimeException;

public class InvalidDateRangeException extends DateTimeException {
    public InvalidDateRangeException() {
        super("Start date must not come after the end date.");
    }
}
