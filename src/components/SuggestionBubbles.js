import React from 'react';
import './SuggestionBubbles.css';

function SuggestionBubbles({ onSuggestionClick }) {
  const suggestions = [
    "Is er een speelplein voor een kind van 4 jaar?",
    "Welke speelpleinen zijn er in Kortrijk?",
    "Hoe kan ik inschrijven voor De Warande?",
    "Hoeveel vrije plaatsen zijn er bij 't Ravottertje?"
  ];

  return (
    <div className="suggestion-bubbles">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="suggestion-bubble"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

export default SuggestionBubbles; 