import { useApp } from '../context/AppContext';
import DayGrid from '../components/DayGrid';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { schedule, loading } = useApp();

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>טוען...</div>;

  const dates = Object.keys(schedule).sort();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: 'var(--accent)' }}>לוח שמירות</h1>
        <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>ניהול אדמין</Link>
      </header>

      {dates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: 'var(--secondary-bg)', borderRadius: 8 }}>
          עדיין אין לוח שמירות.
        </div>
      ) : (
        dates.map(date => (
          <DayGrid key={date} date={date} slots={schedule[date]} />
        ))
      )}
    </div>
  );
}
