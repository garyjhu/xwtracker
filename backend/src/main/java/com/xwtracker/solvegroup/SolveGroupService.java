package com.xwtracker.solvegroup;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class SolveGroupService {
    private final SolveGroupRepository solveGroupRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private final Map<DayOfWeek, String> dayOfWeekToGroupName = Map.of(
        DayOfWeek.MONDAY,    "NYT Monday",
        DayOfWeek.TUESDAY,   "NYT Tuesday",
        DayOfWeek.WEDNESDAY, "NYT Wednesday",
        DayOfWeek.THURSDAY,  "NYT Thursday",
        DayOfWeek.FRIDAY,    "NYT Friday",
        DayOfWeek.SATURDAY,  "NYT Saturday",
        DayOfWeek.SUNDAY,    "NYT Sunday"
    );

    public SolveGroupService(SolveGroupRepository solveGroupRepository) {
        this.solveGroupRepository = solveGroupRepository;
    }

    public SolveGroup getNytSolveGroupFromPrintDate(String printDate, PuzzleTrackerUser user) {
        DayOfWeek dayOfWeek = LocalDate.parse(printDate, formatter).getDayOfWeek();
        return solveGroupRepository.findByNameAndUser(dayOfWeekToGroupName.get(dayOfWeek), user);
    }
}
