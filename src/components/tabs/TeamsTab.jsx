import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { saveTeam, deleteTeam, saveSoldier, deleteSoldier } from '../../services/teamsService';
import { v4 as uuidv4 } from 'uuid';

export default function TeamsTab() {
  const { teams } = useApp();
  const [newTeamName, setNewTeamName] = useState('');
  const [newSoldierNames, setNewSoldierNames] = useState({}); // teamId -> string

  const handleAddTeam = async () => {
    if (!newTeamName.trim()) return;
    await saveTeam({
      id: uuidv4(),
      name: newTeamName,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      sortOrder: teams.length
    });
    setNewTeamName('');
  };

  const handleAddSoldier = async (teamId) => {
    const name = newSoldierNames[teamId];
    if (!name || !name.trim()) return;
    await saveSoldier({
      id: uuidv4(),
      teamId,
      name: name.trim()
    });
    setNewSoldierNames({ ...newSoldierNames, [teamId]: '' });
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <input 
          placeholder="שם צוות חדש" 
          value={newTeamName} 
          onChange={e => setNewTeamName(e.target.value)}
        />
        <button onClick={handleAddTeam}>הוסף צוות</button>
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        {teams.map(team => (
          <div key={team.id} style={{ border: '1px solid #444', padding: 16, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, color: team.color }}>{team.name}</h3>
              <button onClick={() => deleteTeam(team.id)} style={{ background: '#991b1b', padding: '4px 8px', fontSize: '0.8rem' }}>מחק צוות</button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input 
                placeholder="שם חייל" 
                value={newSoldierNames[team.id] || ''} 
                onChange={e => setNewSoldierNames({ ...newSoldierNames, [team.id]: e.target.value })}
                style={{ flex: 1 }}
              />
              <button onClick={() => handleAddSoldier(team.id)}>הוסף חייל</button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {team.soldiers.map(soldier => (
                <div key={soldier.id} style={{ background: '#333', padding: '4px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{soldier.name}</span>
                  <button 
                    onClick={() => deleteSoldier(soldier.id)}
                    style={{ background: 'transparent', color: '#f87171', padding: 0, fontSize: '1.2rem', lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
