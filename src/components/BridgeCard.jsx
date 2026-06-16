export default function BridgeCard({ slot }) {
  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = (t % 1) * 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return (
    <div style={{ 
      background: '#374151', 
      padding: '8px 16px', 
      borderRadius: 8, 
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#d1d5db',
      border: '1px dashed #4b5563'
    }}>
      גשר: {formatTime(slot.from)} - {formatTime(slot.to)}
    </div>
  );
}
