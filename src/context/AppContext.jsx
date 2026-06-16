import { createContext, useContext, useState, useEffect } from 'react';
import { watchTeams, watchSoldiers } from '../services/teamsService';
import { watchSettings, ensureDefaultSettings } from '../services/settingsService';
import { watchSchedule, regenerateSchedule, dateStr } from '../services/scheduleService';
import { watchAuthState } from '../services/authService';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [teamsRaw, setTeamsRaw] = useState([]);
  const [soldiers, setSoldiers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Merge teams + soldiers
  const teams = teamsRaw.map(t => ({
    ...t,
    soldiers: soldiers.filter(s => s.teamId === t.id),
  }));

  useEffect(() => {
    ensureDefaultSettings();
    const unsubTeams = watchTeams(setTeamsRaw);
    const unsubSoldiers = watchSoldiers(setSoldiers);
    const unsubSettings = watchSettings((s) => { 
      setSettings(s); 
      setLoading(false); 
    });
    const unsubAuth = watchAuthState(setIsAdmin);
    const unsubSchedule = watchSchedule(14, (data) => {
      setSchedule(data);
    });

    return () => {
      unsubTeams(); unsubSoldiers(); unsubSettings(); unsubAuth(); unsubSchedule();
    };
  }, []);

  const regen = async () => {
    if (!settings) return;
    await regenerateSchedule(teams, settings, 14);
  };

  return (
    <AppContext.Provider value={{ teams, settings, schedule, isAdmin, loading, regen }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
