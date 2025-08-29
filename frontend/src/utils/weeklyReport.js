// weeklyReport.js - JavaScript version of your weekly report generator

/**
 * Generates a weekly report for tasks within a specific week
 * @param {Array} allTasks - Array of all tasks
 * @param {string} weekStartStr - Week start date in YYYY-MM-DD format
 * @returns {Object} Weekly report data
 */
export function generateWeeklyReport(allTasks, weekStartStr) {
  const weekStart = new Date(weekStartStr);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  // Filter tasks that fall within the week
  const weekTasks = allTasks.filter(task => {
    const taskStart = new Date(task.date);
    return taskStart >= weekStart && taskStart <= weekEnd;
  });
  
  // Sort tasks by date and time
  const sortedTasks = weekTasks.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA - dateB;
  });
  
  // Group tasks by day
  const tasksByDay = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(weekStart);
    currentDay.setDate(weekStart.getDate() + i);
    const dateStr = formatDateForReport(currentDay);
    const dayName = dayNames[currentDay.getDay()];
    
    tasksByDay[dateStr] = {
      dayName,
      tasks: [],
      totalDuration: 0
    };
  }
  
  // Assign tasks to days
  sortedTasks.forEach(task => {
    const taskDateStr = formatDateForReport(new Date(task.date));
    if (tasksByDay[taskDateStr]) {
      tasksByDay[taskDateStr].tasks.push(task);
      tasksByDay[taskDateStr].totalDuration += calculateTaskDuration(task);
    }
  });
  
  // Calculate total weekly stats
  const totalTasks = sortedTasks.length;
  const totalDuration = sortedTasks.reduce((sum, task) => sum + calculateTaskDuration(task), 0);
  const completedTasks = sortedTasks.filter(task => task.completed).length;
  
  return {
    weekStart: formatDateForReport(weekStart),
    weekEnd: formatDateForReport(weekEnd),
    tasksByDay,
    totalTasks,
    completedTasks,
    totalDuration,
    averageDailyDuration: totalDuration / 7
  };
}

/**
 * Calculates the duration of a task in minutes
 * @param {Object} task - Task object with date, startTime, endDate, endTime
 * @returns {number} Duration in minutes
 */
function calculateTaskDuration(task) {
  try {
    const start = new Date(`${task.date}T${task.startTime}`);
    const end = new Date(`${task.endDate}T${task.endTime}`);
    const durationMs = end - start;
    return Math.max(0, Math.floor(durationMs / 60000)); // Convert to minutes
  } catch (error) {
    console.error('Error calculating task duration:', error);
    return 0;
  }
}

/**
 * Formats duration from minutes to human readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
}

/**
 * Formats a date for display in reports
 * @param {Date} date 
 * @returns {string}
 */
function formatDateForReport(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Gets the start of the week (Sunday) for a given date
 * @param {Date} date 
 * @returns {string} Week start date in YYYY-MM-DD format
 */
export function getWeekStart(date = new Date()) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day; // Adjust to Sunday
  start.setDate(diff);
  
  // Format as YYYY-MM-DD
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, '0');
  const dayStr = String(start.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${dayStr}`;
}