import SlotCard from './SlotCard';
import BridgeCard from './BridgeCard';

export default function DayGrid({ date, slots }) {
  if (!slots) return null;

  const formatDate = (dStr) => {
    const d = new Date(dStr);
    return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' });
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ borderBottom: '2px solid var(--military-green)', paddingBottom: 8, marginBottom: 16 }}>
        {formatDate(date)}
      </h2>
      <div style={{ display: 'grid', gap: 8 }}>
        {slots.map((slot, i) => (
          slot.type === 'bridge' 
            ? <BridgeCard key={i} slot={slot} />
            : <SlotCard key={i} slot={slot} date={date} />
        ))}
      </div>
    </div>
  );
}
