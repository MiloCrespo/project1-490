import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDuration } from './utils/weeklyReport.js';

function PrintPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedReport = localStorage.getItem('weeklyReportData');
      if (storedReport) {
        setReportData(JSON.parse(storedReport));
      }
    } catch (error) {
      console.error('Error loading weekly report data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="print-page">
        <div className="print-header">
          <Link to="/" className="back-link">← Back to Tasks</Link>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading weekly report...
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="print-page">
        <div className="print-header">
          <Link to="/" className="back-link">← Back to Tasks</Link>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>No Report Data Available</h2>
          <p>Please generate a weekly report from the main page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="print-page">
      <div className="print-header no-print">
        <Link to="/" className="back-link">← Back to Tasks</Link>
        <button onClick={handlePrint} className="print-button">Print Report</button>
      </div>

      <div className="weekly-report">
        <header className="report-header">
          <h1>Weekly Task Report</h1>
          <h2>{reportData.weekStart} - {reportData.weekEnd}</h2>
          <div className="report-summary">
            <div className="summary-item">
              <strong>Total Tasks:</strong> {reportData.totalTasks}
            </div>
            <div className="summary-item">
              <strong>Completed:</strong> {reportData.completedTasks}
            </div>
            <div className="summary-item">
              <strong>Total Duration:</strong> {formatDuration(reportData.totalDuration)}
            </div>
            <div className="summary-item">
              <strong>Avg Daily Duration:</strong> {formatDuration(Math.round(reportData.averageDailyDuration))}
            </div>
          </div>
        </header>

        <div className="report-content">
          {Object.entries(reportData.tasksByDay).map(([date, dayData]) => (
            <div key={date} className="day-section">
              <h3 className="day-header">
                {dayData.dayName}, {date}
                <span className="day-summary">
                  ({dayData.tasks.length} tasks, {formatDuration(dayData.totalDuration)})
                </span>
              </h3>
              
              {dayData.tasks.length === 0 ? (
                <div className="no-tasks">No tasks scheduled</div>
              ) : (
                <div className="tasks-list">
                  {dayData.tasks.map((task, index) => (
                    <div key={task.id || index} className="task-item-report">
                      <div className="task-time">
                        {task.startTime} - {task.endTime}
                      </div>
                      <div className="task-details">
                        <div className="task-title">{task.event}</div>
                        {task.description && (
                          <div className="task-description">{task.description}</div>
                        )}
                        <div className="task-status">
                          {task.completed ? '✅ Completed' : '⏳ Pending'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <footer className="report-footer">
          <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        </footer>
      </div>
    </div>
  );
}

export default PrintPage;