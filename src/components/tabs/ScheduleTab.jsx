import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import OverrideModal from '../OverrideModal';

export default function ScheduleTab() {
  const { schedule, regen, loading } = useApp();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const dates = Object.keys(schedule).sort();

  const handleRegen = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הלוח הקיים וליצור חדש?')) {
      await regen();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <button 
          onClick={handleRegen} 
          disabled={loading}
          style={{ padding: '12px 24px', fontSize: '1.1rem' }}
        >
          {loading ? 'מייצר...' : 'ייצר לוח חדש (14 יום)'}
        </button>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>
          זהירות: פעולה זו תדרוס שינויים ידניים שבוצעו.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {dates.map(date => (
          <div key={date} style={{ border: '1px solid #444', borderRadius: 8 }}>
            <button 
              onClick={() => setSelectedDate(selectedDate === date ? null : date)}
              style={{ width: '100%', textAlign: 'right', background: 'transparent', padding: 12 }}
            >
              {date} {selectedDate === date ? '▲' : '▼'}
            </button>
            
            {selectedDate === date && (
              <div style={{ padding: 8, display: 'grid', gap: 4, background: '#1a1c1e' }}>
                {schedule[date].map((slot, i) => (
                  slot.type === 'guard' && (
                    <div key={i} style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 12px', background: 'var(--secondary-bg)', borderRadius: 4
                    }}>
                      <span>{String(slot.hour).padStart(2, '0')}:{slot.startMin === 30 ? '30' : '00'} - {slot.soldierName}</span>
                      <button 
                        onClick={() => setSelectedSlot({ ...slot, date })}
                        style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#374151' }}
                      >
                        שינוי
                      </button>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedSlot && (
        <OverrideModal 
          date={selectedSlot.date} 
          slot={selectedSlot} 
          onClose={() => setSelectedSlot(null)} 
        />
      )}
    </div>
  );
}
