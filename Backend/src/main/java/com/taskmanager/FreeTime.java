// FreeTime.java
class FreeTime {
    String date;
    String startTime;
    String endTime;
    double hours;
    
    public FreeTime(String date, String startTime, String endTime, double hours) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.hours = hours;
    }
    
    @Override
    public String toString() {
        return "Free: " + date + " " + startTime + "-" + endTime + " (" + hours + "h)";
    }
}