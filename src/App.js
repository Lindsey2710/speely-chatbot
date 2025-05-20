import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import ChatWindow from './components/ChatWindow';
import MapView from './components/MapView';
import Calendar from './components/Calendar';
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import { read, utils } from 'xlsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6b7ff2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [view, setView] = useState('chat');
  const [speelpleinData, setSpeelpleinData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Laad data bij startup
    const loadData = async () => {
      try {
        const response = await fetch('./data/speelplein-data.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = utils.sheet_to_json(worksheet);
        setSpeelpleinData(data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <button 
          className={`menu-toggle ${isSidebarOpen ? 'open' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Voorkom dat de click event bubbelt
            toggleSidebar();
          }}
          aria-label="Toggle menu"
        />
        
        {/* Overlay voor mobiel */}
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
          onClick={closeSidebar}
        />

        <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="logo">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2784/2784589.png" 
              alt="Speely" 
              style={{ width: '80px', height: '80px' }}
            />
            <h1>Speely</h1>
          </div>
          
          <button 
            className={view === 'chat' ? 'active' : ''} 
            onClick={() => { setView('chat'); closeSidebar(); }}
          >
            💬 Chat
          </button>
          <button 
            className={view === 'map' ? 'active' : ''} 
            onClick={() => { setView('map'); closeSidebar(); }}
          >
            🗺️ Kaart
          </button>
          <button 
            className={view === 'calendar' ? 'active' : ''} 
            onClick={() => { setView('calendar'); closeSidebar(); }}
          >
            📅 Kalender
          </button>
          <button 
            className={view === 'admin' ? 'active' : ''} 
            onClick={() => { setView('admin'); closeSidebar(); }}
          >
            📋 Alle Speelpleinen
          </button>
        </nav>
        
        <main 
          className="main-content" 
          onClick={() => {
            if (isSidebarOpen) {
              closeSidebar();
            }
          }}
        >
          {view === 'chat' && <ChatWindow />}
          {view === 'map' && <MapView speelpleinen={speelpleinData} />}
          {view === 'calendar' && <Calendar activities={speelpleinData} />}
          {view === 'admin' && <AdminDashboard speelpleinen={speelpleinData} />}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App; 