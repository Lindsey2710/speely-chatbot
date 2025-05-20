import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ speelpleinen }) {
  const [activeTab, setActiveTab] = useState('speelpleinen');
  const [inschrijvingen, setInschrijvingen] = useState([]);

  // Helper functie voor datumconversie
  const formatExcelDate = (excelDate) => {
    if (!excelDate) return '';
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toLocaleDateString('nl-BE');
  };

  useEffect(() => {
    if (speelpleinen) {
      const inschrijvingenData = speelpleinen.map(plein => ({
        speelplein: plein.Speelplein,
        totaal_plaatsen: plein.Max_kinderen,
        beschikbaar: plein.Beschikbare_plaatsen,
        ingeschreven: plein.Max_kinderen - plein.Beschikbare_plaatsen,
        startdatum: formatExcelDate(plein.Datum),
        einddatum: formatExcelDate(plein.Datum + 5), // 5 dagen later
        periode: `${formatExcelDate(plein.Datum)} - ${formatExcelDate(plein.Datum + 5)}`
      }));
      setInschrijvingen(inschrijvingenData);
    }
  }, [speelpleinen]);

  // Check of speelpleinen bestaat en niet leeg is
  if (!speelpleinen || speelpleinen.length === 0) {
    return (
      <div className="admin-dashboard">
        <div className="loading-message">
          <h2>Speelplein data wordt geladen...</h2>
          <p>Even geduld aub.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button 
          className={activeTab === 'speelpleinen' ? 'active' : ''} 
          onClick={() => setActiveTab('speelpleinen')}
        >
          Alle Speelpleinen ({speelpleinen.length})
        </button>
        <button 
          className={activeTab === 'inschrijvingen' ? 'active' : ''} 
          onClick={() => setActiveTab('inschrijvingen')}
        >
          Inschrijvingen Overzicht
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'speelpleinen' && speelpleinen && (
          <>
            {/* Tabel view voor grote schermen */}
            <div className="speelpleinen-tabel">
              <table>
                <thead>
                  <tr>
                    <th>Speelplein</th>
                    <th>Gemeente</th>
                    <th>Periode</th>
                    <th>Leeftijd</th>
                    <th>Beschikbaar</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {speelpleinen.map((plein, index) => (
                    <tr key={index}>
                      <td>{plein.Speelplein}</td>
                      <td>{plein.Gemeente}</td>
                      <td>{formatExcelDate(plein.Datum)} - {formatExcelDate(plein.Datum + 5)}</td>
                      <td>{plein.Leeftijdsgroep}</td>
                      <td>{plein.Beschikbare_plaatsen}/{plein.Max_kinderen}</td>
                      <td>{plein.Contactpersoon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grid view voor kleine schermen */}
            <div className="speelpleinen-grid">
              {speelpleinen.map((plein, index) => (
                <div key={index} className="speelplein-card">
                  <h3>{plein.Speelplein}</h3>
                  <div className="speelplein-info">
                    <div className="info-row">
                      <span className="info-label">Gemeente</span>
                      <span className="info-value">{plein.Gemeente}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Periode</span>
                      <span className="info-value">{formatExcelDate(plein.Datum)} - {formatExcelDate(plein.Datum + 5)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Leeftijd</span>
                      <span className="info-value">{plein.Leeftijdsgroep}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Beschikbaar</span>
                      <span className="info-value">{plein.Beschikbare_plaatsen}/{plein.Max_kinderen}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Contact</span>
                      <span className="info-value">{plein.Contactpersoon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'inschrijvingen' && inschrijvingen.length > 0 && (
          <>
            {/* Tabel view voor grote schermen */}
            <div className="inschrijvingen-tabel">
              <table>
                <thead>
                  <tr>
                    <th>Speelplein</th>
                    <th>Periode</th>
                    <th>Totaal Plaatsen</th>
                    <th>Ingeschreven</th>
                    <th>Beschikbaar</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inschrijvingen.map((inschrijving, index) => (
                    <tr key={index}>
                      <td>{inschrijving.speelplein}</td>
                      <td>{inschrijving.periode}</td>
                      <td>{inschrijving.totaal_plaatsen}</td>
                      <td>{inschrijving.ingeschreven}</td>
                      <td>{inschrijving.beschikbaar}</td>
                      <td>
                        <span className={`status ${inschrijving.beschikbaar > 0 ? 'open' : 'vol'}`}>
                          {inschrijving.beschikbaar > 0 ? 'Open' : 'Vol'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grid view voor kleine schermen */}
            <div className="inschrijvingen-grid">
              {inschrijvingen.map((inschrijving, index) => (
                <div key={index} className="inschrijving-card">
                  <div className="inschrijving-header">
                    <h3>{inschrijving.speelplein}</h3>
                    <span className={`status ${inschrijving.beschikbaar > 0 ? 'open' : 'vol'}`}>
                      {inschrijving.beschikbaar > 0 ? 'Open' : 'Vol'}
                    </span>
                  </div>
                  <div className="inschrijving-content">
                    <div className="inschrijving-row">
                      <span className="inschrijving-label">Periode</span>
                      <span className="inschrijving-value">{inschrijving.periode}</span>
                    </div>
                    <div className="inschrijving-row">
                      <span className="inschrijving-label">Totaal plaatsen</span>
                      <span className="inschrijving-value">{inschrijving.totaal_plaatsen}</span>
                    </div>
                    <div className="inschrijving-row">
                      <span className="inschrijving-label">Ingeschreven</span>
                      <span className="inschrijving-value">{inschrijving.ingeschreven}</span>
                    </div>
                    <div className="inschrijving-row">
                      <span className="inschrijving-label">Beschikbaar</span>
                      <span className="inschrijving-value">{inschrijving.beschikbaar}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard; 