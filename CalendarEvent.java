import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

class CalendarEvent 
{
    String title;
    LocalDateTime startTime;
    LocalDateTime endTime;
    
    public CalendarEvent(String title, LocalDateTime startTime, LocalDateTime endTime) 
    {
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    
    public double getHours() 
    {
        return java.time.Duration.between(startTime, endTime).toMinutes() / 60.0;
    }
    
    @Override
    public String toString() 
    {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd HH:mm");
        return title + " (" + startTime.format(formatter) + " - " + endTime.format(formatter) + ") - " + getHours() + "h";
    }
}
