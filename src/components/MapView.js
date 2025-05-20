import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css'; // Voeg styling toe

// Fix voor marker iconen
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Standaard coördinaten voor Vlaamse steden
const CITY_COORDS = {
  'brugge': [51.209348, 3.224700],
  'kortrijk': [50.827778, 3.265278],
  'roeselare': [50.946389, 3.128889]
};

function MapView({ speelpleinen }) {
  // Centreer de kaart op Kortrijk als default
  const defaultCenter = CITY_COORDS['kortrijk'];
  
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {speelpleinen.map((plein, index) => {
          const coords = CITY_COORDS[plein.Gemeente.toLowerCase()];
          if (!coords) return null;

          return (
            <Marker 
              key={index} 
              position={coords}
            >
              <Popup>
                <div className="speelplein-popup">
                  <h3>{plein.Speelplein}</h3>
                  <p>Voor kindjes van {plein.Leeftijdsgroep}</p>
                  <p>Nog {plein.Beschikbare_plaatsen} plaatsen beschikbaar</p>
                  <p>Contact: {plein.Contactpersoon}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView; 