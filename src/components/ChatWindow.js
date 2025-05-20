import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import { read, utils } from 'xlsx';
import SuggestionBubbles from './SuggestionBubbles';
import { botConfig } from '../config/botConfig';

/**
 * ChatWindow Component
 * Hoofdcomponent voor de chatbot interface
 */
function ChatWindow() {
  // State management
  const [messages, setMessages] = useState([
    { text: botConfig.welcomeMessage, isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [speelpleinData, setSpeelpleinData] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll naar laatste bericht
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Laad Excel data bij component mount
  useEffect(() => {
    const loadExcelData = async () => {
      try {
        console.log('Start loading Excel data...');
        const response = await fetch(botConfig.dataPath);
        console.log('Fetch response:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log('Received array buffer');
        
        const workbook = read(arrayBuffer, { type: 'array' });
        console.log('Parsed workbook:', workbook.SheetNames);
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = utils.sheet_to_json(worksheet);
        console.log('Loaded data:', data);
        
        if (!data || data.length === 0) {
          throw new Error('No data found in Excel file');
        }
        
        setSpeelpleinData(data);
      } catch (error) {
        console.error('Error loading Excel data:', error);
        setMessages(prev => [...prev, { 
          text: `Sorry, er was een probleem met het laden van de speelplein data: ${error.message}`, 
          isBot: true 
        }]);
      }
    };

    loadExcelData();
  }, []);

  // Verwerk gebruikersvraag en genereer antwoord
  const processQuestion = async (question, data) => {
    question = question.toLowerCase();
    
    if (!data) return "Sorry, ik kan momenteel geen data laden. Probeer het later opnieuw. 💫";

    // Datum/periode check
    if (question.includes('wanneer') || question.includes('datum')) {
      const speelpleinMatch = data.find(row => 
        question.toLowerCase().includes(row.Speelplein.toLowerCase())
      );

      if (speelpleinMatch) {
        const formatDate = (excelDate) => {
          if (!excelDate) return '';
          const date = new Date((excelDate - 25569) * 86400 * 1000);
          return date.toLocaleDateString('nl-BE');
        };

        const startDatum = formatDate(speelpleinMatch.Datum);
        const eindDatum = formatDate(speelpleinMatch.Datum + 5);

        return `${speelpleinMatch.Speelplein} is open van ${startDatum} tot ${eindDatum} (5 dagen) 🗓️\n\nWil je graag inschrijven of heb je nog andere vragen? 😊`;
      }
    }

    // Gemeente/locatie check
    if (question.includes('gemeente') || question.includes('waar') || question.includes('welke') || question.includes('kortrijk') || question.includes('brugge')) {
      const gemeentes = [...new Set(data.map(row => row.Gemeente))];
      const speelpleinen = data
        .filter(row => question.toLowerCase().includes(row.Gemeente.toLowerCase()))
        .map(row => `✨ ${row.Speelplein}:\n• Voor kindjes van ${row.Leeftijdsgroep} jaar\n• Nog ${row.Beschikbare_plaatsen} plaatsjes beschikbaar\n• Contactpersoon: ${row.Contactpersoon}`)
        .join('\n\n');

      if (speelpleinen) {
        return `Hier zijn de speelpleinen die we hebben: 🏡\n\n${speelpleinen}\n\nWil je meer weten over een specifiek speelplein? 😊`;
      }
      
      return `We hebben speelpleinen in deze gemeentes: ${gemeentes.join(', ')} 🏡\n\nOver welke gemeente wil je meer weten? 😊`;
    }

    // Beschikbare plaatsen check
    if (question.includes('hoeveel') || question.includes('beschikbaar') || question.includes('plaats') || question.includes('vol') || question.includes('vrij')) {
      const speelpleinMatch = data.find(row => 
        question.toLowerCase().includes(row.Speelplein.toLowerCase())
      );

      if (speelpleinMatch) {
        return `Bij ${speelpleinMatch.Speelplein} zijn er nog ${speelpleinMatch.Beschikbare_plaatsen} van de ${speelpleinMatch.Max_kinderen} plaatsjes beschikbaar! 🌟\n\nWil je graag inschrijven of heb je nog andere vragen? 😊`;
      }

      const availablePlaces = data
        .map(row => `✨ ${row.Speelplein}:\n• Nog ${row.Beschikbare_plaatsen} van de ${row.Max_kinderen} plaatsjes vrij\n• Voor kindjes van ${row.Leeftijdsgroep}`)
        .join('\n\n');

      return `Hier zie je een overzicht van de beschikbare plaatsen:\n\n${availablePlaces}\n\nKan ik je helpen met inschrijven? 😊`;
    }

    // Leeftijd check
    if (question.includes('leeftijd') || question.includes('jaar') || question.includes('oud')) {
      const leeftijdMatch = question.match(/\d+/);
      if (leeftijdMatch) {
        const leeftijd = parseInt(leeftijdMatch[0]);
        const geschikte_speelpleinen = data
          .filter(row => {
            const [min, max] = row.Leeftijdsgroep.split('-').map(num => parseInt(num));
            return leeftijd >= min && leeftijd <= max;
          })
          .map(row => `✨ ${row.Speelplein}:\n• Voor kindjes van ${row.Leeftijdsgroep} jaar\n• Nog ${row.Beschikbare_plaatsen} plaatsjes beschikbaar`)
          .join('\n\n');

        if (geschikte_speelpleinen) {
          return `Voor een kindje van ${leeftijd} jaar hebben we deze leuke speelpleinen:\n\n${geschikte_speelpleinen}\n\nZal ik je helpen met inschrijven? 😊`;
        }
      }
      
      const leeftijdsgroepen = data.map(row => `• ${row.Speelplein}: ${row.Leeftijdsgroep} jaar`).join('\n');
      return `Hier zijn alle speelpleinen met hun leeftijdsgroepen:\n${leeftijdsgroepen}\n\nVoor welke leeftijd zoek je een speelplein? 🤔`;
    }

    // Inschrijvingsvraag
    if (question.includes('inschrijven') || question.includes('schrijf') || question.includes('aanmelden') || 
        question.includes('hoe') || question.includes('waar kan ik')) {
      
      // Als er een specifiek speelplein wordt genoemd
      const speelpleinMatch = data.find(row => 
        question.toLowerCase().includes(row.Speelplein.toLowerCase())
      );

      if (speelpleinMatch) {
        return `Super dat je wil inschrijven voor ${speelpleinMatch.Speelplein}! 🌟\n\n` +
               `Je kan heel eenvoudig inschrijven door in de kalender te klikken op de datum waarop je wil inschrijven. ` +
               `Daar vind je de inschrijvingslink! 📅\n\n` +
               `📋 Belangrijke info:\n` +
               `• Er zijn nog ${speelpleinMatch.Beschikbare_plaatsen} plaatsjes beschikbaar\n` +
               `• Het speelplein is voor kindjes van ${speelpleinMatch.Leeftijdsgroep} jaar\n\n` +
               `Lukt het niet? Ik help je graag verder! 💫`;
      }

      // Algemene inschrijvingsvraag
      return `Je kan heel eenvoudig inschrijven voor een speelplein! 🌟\n\n` +
             `Zo werkt het:\n` +
             `1. Kijk in de kalender wanneer het speelplein open is 📅\n` +
             `2. Klik op de datum waarop je wil inschrijven\n` +
             `3. Je vindt daar direct de inschrijvingslink\n\n` +
             `Wil je weten welke speelpleinen er zijn? Of heb je andere vragen? Ik help je graag! 😊`;
    }

    return botConfig.defaultResponse;
  };

  // Event handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Voeg gebruikersbericht toe
    const userMessage = { text: inputText, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Toon typing indicator
    setMessages(prev => [...prev, { text: "...", isBot: true, isTyping: true }]);

    // Process vraag en wacht op antwoord
    const answer = await processQuestion(inputText, speelpleinData);

    // Verwijder typing indicator en voeg antwoord toe
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      setMessages(prev => [...prev, { text: answer, isBot: true }]);
    }, 1500);
  };

  // Render component
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="bot-avatar">{botConfig.avatar}</div>
        <h2>{botConfig.name} Assistant</h2>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.isBot ? 'bot' : 'user'} ${message.isTyping ? 'typing' : ''}`}
          >
            {message.isBot && <div className="bot-avatar">🤖</div>}
            <div className="message-bubble">
              {message.isTyping ? (
                <div className="typing-indicator">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              ) : (
                message.text
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="suggestions-container">
          <SuggestionBubbles onSuggestionClick={text => setInputText(text)} />
        </div>
        
        <form onSubmit={handleSubmit} className="chat-input-form">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Typ je bericht..."
            className="chat-input"
            rows="1"
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!inputText.trim()}
            aria-label="Verstuur bericht"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow; 