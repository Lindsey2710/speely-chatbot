import React from 'react';
import './LanguageSelector.css';

function LanguageSelector({ currentLang, onLanguageChange }) {
  return (
    <div className="language-selector">
      <button 
        className={currentLang === 'nl' ? 'active' : ''} 
        onClick={() => onLanguageChange('nl')}
      >
        🇳🇱 NL
      </button>
      <button 
        className={currentLang === 'en' ? 'active' : ''} 
        onClick={() => onLanguageChange('en')}
      >
        🇬🇧 EN
      </button>
      <button 
        className={currentLang === 'fr' ? 'active' : ''} 
        onClick={() => onLanguageChange('fr')}
      >
        🇫🇷 FR
      </button>
    </div>
  );
}

export default LanguageSelector; 