import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_INCIDENTS } from '../services/mockData';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // Load from localStorage or initialize with mockData
  useEffect(() => {
    const storedData = localStorage.getItem('demo_incidents');
    let loaded = false;
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed)) {
          setIncidents(parsed);
          loaded = true;
        }
      } catch (e) {
        console.error('Failed to parse stored demo_incidents, resetting to mock data.');
      }
    }
    
    if (!loaded) {
      setIncidents(MOCK_INCIDENTS);
      localStorage.setItem('demo_incidents', JSON.stringify(MOCK_INCIDENTS));
    }
    setIsReady(true);
  }, []);

  // Save to localStorage whenever incidents change
  useEffect(() => {
    if (isReady) {
      localStorage.setItem('demo_incidents', JSON.stringify(incidents));
    }
  }, [incidents, isReady]);

  // Methods
  const addIncident = (incident) => {
    const newIncident = {
      _id: `mock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Active',
      verificationStatus: 'Unverified',
      ...incident
    };
    setIncidents(prev => [newIncident, ...prev]);
    return newIncident._id;
  };

  const updateIncidentStatus = (id, updates) => {
    setIncidents(prev => prev.map(inc => {
      if (inc._id === id) {
        return { ...inc, ...updates, updatedAt: new Date().toISOString() };
      }
      return inc;
    }));
  };

  const addReportToIncident = (incidentId, reportText, reportedBy) => {
    setIncidents(prev => prev.map(inc => {
      if (inc._id === incidentId) {
        const existingReports = inc.additionalReports || [];
        return {
          ...inc,
          additionalReports: [...existingReports, { text: reportText, reportedBy, timestamp: new Date().toISOString() }],
          updatedAt: new Date().toISOString()
        };
      }
      return inc;
    }));
  };

  const resetData = () => {
    setIncidents(MOCK_INCIDENTS);
    localStorage.setItem('demo_incidents', JSON.stringify(MOCK_INCIDENTS));
  };

  if (!isReady) return null;

  return (
    <DataContext.Provider value={{
      incidents,
      addIncident,
      updateIncidentStatus,
      addReportToIncident,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
