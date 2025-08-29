import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

class WeeklyReport {
    
    public static void generateReport(List<CalendarEvent> allEvents, String weekStartStr) 
    {
        System.out.println("Weekly Report");
        System.out.println(weekStartStr + " - " + LocalDate.parse(weekStartStr).plusDays(6).toString() );
        System.out.println("==============================");
        System.out.println(allEvents.toString());
    }
}
