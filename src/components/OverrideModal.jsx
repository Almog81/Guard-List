import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { overrideSlot } from '../services/scheduleService';

export default function OverrideModal({ date, slot, onClose }) {
  const { teams } = useApp();
  const [selectedSoldier, setSelectedSoldier] = useState(null);

  const handleSave = async () => {
    if (!selectedSoldier) return;
    await overrideSlot(date, slot.t, selectedSoldier);
    onClose();
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16
    }}>
      <div style={{ background: 'var(--secondary-bg)', padding: 24, borderRadius: 12, width: '100%', maxWidth: 500 }}>
        <h3 style={{ marginTop: 0 }}>שינוי חייל ידני</h3>
        <p style={{ color: 'var(--text-muted)' }}>בחר חייל עבור השעה {slot.hour}:{slot.startMin === 30 ? '30' : '00'}</p>
        
        <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 20, display: 'grid', gap: 12 }}>
          {teams.map(team => (
            <div key={team.id}>
              <div style={{ fontSize: '0.8rem', color: team.color, marginBottom: 4 }}>{team.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {team.soldiers.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSoldier({ ...s, teamId: team.id, teamName: team.name, teamColor: team.color })}
                    style={{
                      background: selectedSoldier?.id === s.id ? 'var(--military-green)' : '#333',
                      border: selectedSoldier?.id === s.id ? '1px solid var(--accent)' : '1px solid transparent',
                      padding: '6px 12px'
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #444' }}>ביטול</button>
          <button onClick={handleSave} disabled={!selectedSoldier}>שמור שינוי</button>
        </div>
      </div>
    </div>
  );
}
