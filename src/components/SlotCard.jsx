export default function SlotCard({ slot }) {
  const formatTime = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  
  return (
    <div style={{ 
      background: 'var(--secondary-bg)', 
      padding: '12px 16px', 
      borderRadius: 8, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderRight: `4px solid ${slot.teamColor || '#555'}`
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
          {slot.soldierName || '---'}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {slot.teamName || 'צוות לא ידוע'}
        </div>
      </div>
      
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
          {formatTime(slot.hour, slot.startMin)} - {formatTime(slot.endHour, slot.endMin)}
        </div>
        {slot.isOverride && (
          <span style={{ fontSize: '0.7rem', background: '#991b1b', padding: '2px 6px', borderRadius: 4 }}>
            שינוי ידני
          </span>
        )}
      </div>
    </div>
  );
}
