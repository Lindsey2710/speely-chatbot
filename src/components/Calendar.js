import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Calendar.css';

function Calendar({ activities }) {
  const [selectedSpeelpleinen, setSelectedSpeelpleinen] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (activities && activities.length > 0) {
      console.log('Ruwe activiteiten data:', activities);

      const calendarEvents = activities.map(activity => {
        // Converteer Excel numerieke datum naar JavaScript datum
        const excelDateToJSDate = (excelDate) => {
          if (!excelDate) return null;
          // Excel datum begint vanaf 1900-01-01, dus we moeten 25569 dagen aftrekken
          // voor de Unix epoch (1970-01-01)
          const date = new Date((excelDate - 25569) * 86400 * 1000);
          return date;
        };

        const startDate = excelDateToJSDate(activity.Datum);
        const endDate = startDate ? new Date(startDate.getTime() + (5 * 24 * 60 * 60 * 1000)) : null;

        // Formatteer voor weergave (DD-MM-YYYY)
        const formatDateForDisplay = (date) => {
          if (!date) return '';
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        };

        // Formatteer voor kalender (YYYY-MM-DD)
        const formatDateForCalendar = (date) => {
          if (!date) return null;
          return date.toISOString().split('T')[0];
        };

        console.log('Data voor', activity.Speelplein, {
          excelDate: activity.Datum,
          parsedStart: startDate,
          parsedEnd: endDate,
          displayStart: formatDateForDisplay(startDate),
          displayEnd: formatDateForDisplay(endDate)
        });

        return {
          title: activity.Speelplein,
          start: formatDateForCalendar(startDate),
          end: formatDateForCalendar(endDate),
          backgroundColor: activity.Beschikbare_plaatsen > 0 ? '#6b7ff2' : '#ff4757',
          textColor: 'white',
          borderRadius: '4px',
          display: 'block',
          extendedProps: {
            ...activity,
            formattedStartDate: formatDateForDisplay(startDate),
            formattedEndDate: formatDateForDisplay(endDate),
            periode: startDate && endDate ? 
              `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)} (5 dagen)` : 
              'Periode niet beschikbaar'
          }
        };
      }).filter(event => event.start && event.end);

      console.log('Verwerkte kalender events:', calendarEvents);
      setEvents(calendarEvents);
    }
  }, [activities]);

  const handleEventClick = (info) => {
    const activity = info.event.extendedProps;
    setSelectedSpeelpleinen(
      <div className="speelplein-details">
        <div className="details-header">
          <h3>{activity.Speelplein}</h3>
          <span className={`status-badge ${activity.Beschikbare_plaatsen > 0 ? 'available' : 'full'}`}>
            {activity.Beschikbare_plaatsen > 0 ? 'Beschikbaar' : 'Vol'}
          </span>
        </div>
        <div className="details-content">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">📍 Gemeente</span>
              <span className="info-value">{activity.Gemeente}</span>
            </div>
            <div className="info-item">
              <span className="info-label">📅 Periode</span>
              <span className="info-value">
                {activity.periode || `${activity.formattedStartDate} - ${activity.formattedEndDate}`}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">👶 Leeftijd</span>
              <span className="info-value">{activity.Leeftijdsgroep}</span>
            </div>
            <div className="info-item">
              <span className="info-label">🎯 Beschikbaar</span>
              <span className="info-value">{activity.Beschikbare_plaatsen}/{activity.Max_kinderen} plaatsen</span>
            </div>
            <div className="info-item">
              <span className="info-label">👤 Contact</span>
              <span className="info-value">{activity.Contactpersoon}</span>
            </div>
          </div>
          <div className="details-actions">
            <a 
              href={activity.Inschrijvingslink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inschrijven-button"
            >
              Direct Inschrijven
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          headerToolbar={{
            left: window.innerWidth > 768 ? 'prev,next today' : 'prev,next',
            center: 'title',
            right: window.innerWidth > 768 ? 'dayGridMonth' : ''
          }}
          eventContent={(arg) => (
            <div className="calendar-event">
              <div className="event-title">{arg.event.title}</div>
              {window.innerWidth > 767 && (
                <div className="event-details">
                  <div className="event-date">
                    {arg.event.extendedProps.formattedStartDate}
                  </div>
                  <div className="event-capacity">
                    {arg.event.extendedProps.Beschikbare_plaatsen} plaatsen
                  </div>
                </div>
              )}
            </div>
          )}
          height="auto"
          contentHeight="auto"
          dayMaxEvents={window.innerWidth > 768 ? false : 2}
          moreLinkText={count => `+${count} meer`}
          moreLinkClick="popover"
        />
      </div>
      {selectedSpeelpleinen && (
        <div className="selected-speelpleinen">
          {selectedSpeelpleinen}
        </div>
      )}
    </div>
  );
}

export default Calendar; 