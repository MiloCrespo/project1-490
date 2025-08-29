import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WeekNavigator from './WeekNavigator';
import WeeklyAnalytics from './WeeklyAnalytics';

/**
 * PrintPage - Enhanced with weekly analytics and navigation
 */
export default function PrintPage() {
  const [activeTasks, setActiveTasks] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [currentWeekTasks, setCurrentWeekTasks] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('activeTasks') || '[]');
      const tasks = Array.isArray(saved) ? saved : [];
      setActiveTasks(tasks);
      setCurrentWeekTasks(tasks); // Initialize with all tasks
    } catch (e) {
      setActiveTasks([]);
      setCurrentWeekTasks([]);
    }
  }, []);

  const handleWeekChange = (weekStart, weekDates) => {
    // Filter tasks for the selected week
    const weekTasks = activeTasks.filter(task => 
      task.date && weekDates.includes(task.date)
    );
    setCurrentWeekTasks(weekTasks);
  };

  const groupedByStartDate = useMemo(() => {
    const tasksToUse = showAnalytics ? currentWeekTasks : activeTasks;
    const groups = new Map();
    for (const t of tasksToUse) {
      const dateKey = t.date || '';
      if (!groups.has(dateKey)) groups.set(dateKey, []);
      groups.get(dateKey).push(t);
    }
    for (const [_, list] of groups.entries()) {
      list.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
    }
    const entries = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
    return entries;
  }, [activeTasks, currentWeekTasks, showAnalytics]);

  const formatDateDisplay = (yyyyMmDd) => {
    if (!yyyyMmDd) return 'No date';
    const [y, m, d] = yyyyMmDd.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const parseLocalDateTime = (yyyyMmDd, hhmm) => {
    if (!yyyyMmDd) return null;
    const [y, m, d] = yyyyMmDd.split('-').map(Number);
    const [hh, mm] = (hhmm || '').split(':').map(Number);
    return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
  };

  const formatDuration = (startDateStr, start, endDateStr, end) => {
    const startDate = parseLocalDateTime(startDateStr, start);
    const endDate = parseLocalDateTime(endDateStr, end);
    if (!startDate || !endDate) return '';
    const dateDifference = endDate - startDate;
    const minutesTotal = Math.max(0, Math.floor(dateDifference / 60000));
    const hours = Math.floor(minutesTotal / 60);
    const minutes = minutesTotal % 60;
    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    return `${minutes}m`;
  };

  const downloadCalendar = () => {
    const tasksToExport = showAnalytics ? currentWeekTasks : activeTasks;
    if (!tasksToExport.length) return;
    
    const groups = new Map();
    for (const t of tasksToExport) {
      const dateKey = t.date || '';
      if (!groups.has(dateKey)) groups.set(dateKey, []);
      groups.get(dateKey).push(t);
    }
    
    const lines = [];
    const sortedEntries = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
    
    for (const [dateKey, tasks] of sortedEntries) {
      for (const t of tasks) {
        const dateLabel = formatDateDisplay(dateKey);
        const descPart = t.description ? ` : ${t.description}` : '';
        const start = t.startTime || '';
        const end = t.endTime || '';
        const duration = formatDuration(t.date, t.startTime, t.endDate || t.date, t.endTime);
        lines.push(`${dateLabel} : ${t.event}${descPart} , ${start} - ${end} - ${duration}`);
      }
    }
    
    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = showAnalytics ? 'weekly-tasks.txt' : 'tasks.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="title">
        {showAnalytics ? "Weekly Analytics" : "Upcoming Calendar"}
      </h1>
      
      <WeekNavigator 
        tasks={activeTasks} 
        onWeekChange={handleWeekChange} 
      />
      
      {showAnalytics ? (
        <WeeklyAnalytics tasks={currentWeekTasks.length ? currentWeekTasks : activeTasks} />
      ) : (
        <div className="calendar-container">
          {groupedByStartDate.length === 0 ? (
            <div className="empty-state" style={{ height: '200px' }}>No tasks to display</div>
          ) : (
            <div className="calendar-grid">
              {groupedByStartDate.map(([date, tasks]) => (
                <div key={date || 'no-date'} className="calendar-day">
                  <div className="calendar-day-header">{formatDateDisplay(date)}</div>
                  <ul className="calendar-events">
                    {tasks.map((t) => (
                      <li key={t.id || `${t.event}-${t.startTime}` } className="calendar-event">
                        <div className="calendar-event-time">{(t.startTime || '')} {(t.endTime ? `— ${t.endTime}` : '')}</div>
                        <div className="calendar-event-title">{t.event}</div>
                        {t.description ? (
                          <div className="calendar-event-desc">{t.description}</div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="print-fixed" style={{ display: 'flex', gap: '8px' }}>
        <button 
          type="button" 
          className="submit-button" 
          onClick={() => setShowAnalytics(!showAnalytics)}
        >
          {showAnalytics ? 'Calendar View' : 'Analytics View'}
        </button>
        <PrintButton onClick={downloadCalendar} />
        <MainScreenButton />
      </div>
    </div>
  );
}

function PrintButton({ onClick }) {
  return (
    <button type="button" className="submit-button" onClick={onClick}>
      Download Tasks
    </button>
  );
}

function MainScreenButton() {
  const navigate = useNavigate();
  return (
    <button type="button" className="my-button" onClick={() => navigate('/')}>
      Back to Main Screen
    </button>
  );
}