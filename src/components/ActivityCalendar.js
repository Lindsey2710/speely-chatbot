import React from 'react';
import './ActivityCalendar.css';

function ActivityCalendar({ activities, selectedDate, onDateSelect }) {
  return (
    <div className="activity-calendar">
      <h3>Activiteitenkalender</h3>
      <div className="calendar-grid">
        {/* Kalender implementatie */}
        {activities.map(activity => (
          <div className="activity-item" key={activity.id}>
            <img src={activity.Foto_URL} alt={activity.Speelplein} />
            <h4>{activity.Speelplein}</h4>
            <p>{activity.Activiteiten.join(', ')}</p>
            <p>📅 {activity.Datum}</p>
            <p>⏰ {activity.Openingsuren}</p>
            <p>💰 {activity.Prijs_per_dag}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityCalendar; 