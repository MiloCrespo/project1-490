import java.io.*;
import java.nio.file.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

class IcsParser 
{
    public static List<CalendarEvent> parseFile(String filename) 
    {
        List<CalendarEvent> events = new ArrayList<>();
        
        try 
        {
            String content = Files.readString(Paths.get(filename));
            
            // Split into lines
            String[] lines = content.split("\\r?\\n");
            
            System.out.println("Lines: " + Arrays.toString(lines));



            String title = null;
            LocalDateTime start = null;
            LocalDateTime end = null;
            
            for (int i = 0; i < lines.length; i++) 
            {
                String line = lines[i].trim();
                
                if (line.equals("BEGIN:VEVENT")) 
                {
                    // Reset event fields
                    title = null;
                    start = null;
                    end = null;
                } 
                else if (line.startsWith("SUMMARY:")) 
                {
                    title = line.substring("SUMMARY:".length());
                } 
                else if (line.startsWith("DTSTART")) 
                {
                    start = parseDate(line.split(":", 2)[1]);
                } 
                else if (line.startsWith("DTEND")) 
                {
                    end = parseDate(line.split(":", 2)[1]);
                } 
                else if (line.equals("END:VEVENT")) 
                {
                    if (title != null && start != null && end != null) 
                    {
                        events.add(new CalendarEvent(title, start, end));
                    }
                }
            }
        } 
        catch (IOException e) 
        {
            System.out.println("Error reading file: " + e.getMessage());
        }
        
        return events;
    }
    
    private static LocalDateTime parseDate(String value) 
    {
    try 
    {
        // Case 1: UTC format (with 'Z')
        if (value.endsWith("Z")) 
        {
            DateTimeFormatter utcFormatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'")
                                                             .withZone(ZoneOffset.UTC);
            return LocalDateTime.ofInstant(Instant.from(utcFormatter.parse(value)), ZoneId.systemDefault());
        }
        
        // Case 2: Full datetime without 'Z'
        else if (value.contains("T")) 
        {
            DateTimeFormatter localFormatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");
            return LocalDateTime.parse(value, localFormatter);
        }
       
        // Case 3: Date only (all-day event) -> assume start of day
        else 
        {
            DateTimeFormatter dateOnlyFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
            LocalDate date = LocalDate.parse(value, dateOnlyFormatter);
            return date.atStartOfDay(); // 00:00 local time
        }
    } 
    catch (Exception e) 
    {
        throw new RuntimeException("Failed to parse date: " + value, e);
    }
}

}
