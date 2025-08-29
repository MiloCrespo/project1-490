import java.util.*;

//Step 1: Main class to run the application

public class Main 
{
    public static void main(String[] args) 
    {
        Scanner scanner = new Scanner(System.in);
        
        //Initial user prompts -- To be Replaced with REACT UI later
        System.out.println("ICS Calendar Report Generator");
        System.out.println("=============================");
        
        System.out.print("Enter ICS file path: ");
        String filename = scanner.nextLine();
            
        System.out.print("Enter week start date (YYYY-MM-DD): ");
        String weekStart = scanner.nextLine();
        
        System.out.println("\nParsing calendar file...");
        
        // Parse the ICS file
        List<CalendarEvent> events = IcsParser.parseFile(filename);
        


        if (events.isEmpty()) 
        {
            System.out.println("No events found or file could not be read.");
            scanner.close();
            return;
        }
        
        System.out.println("Found " + events.size() + " events total.");
        
        WeeklyReport.generateReport(events, weekStart);
        
        scanner.close();
    }
}