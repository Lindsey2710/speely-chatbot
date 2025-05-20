export const botConfig = {
  name: "Speely",
  avatar: "🤖",
  welcomeMessage: "Hoi! Ik ben Speely, je virtuele assistent voor de speelpleinen. 👋\n\nIk kan je helpen met:\n• Beschikbare plaatsen checken\n• Informatie over speelpleinen\n• Inschrijvingen\n\nWat wil je weten? 😊",
  defaultResponse: "Sorry, ik begrijp je vraag niet helemaal. 🤔\n\nJe kan me vragen stellen over:\n• Beschikbare plaatsen\n• Speelpleinen in jouw gemeente\n• Leeftijdsgroepen\n• Inschrijven\n\nProbeer het opnieuw! 😊",
  dataPath: "https://speely-chatbot-bl2c.vercel.app/data/speelpleinen.xlsx",
  typingDelay: 1500,
  features: {
    searchByAge: true,
    searchByLocation: true,
    registration: true,
    availability: true,
    contact: true
  }
}; 