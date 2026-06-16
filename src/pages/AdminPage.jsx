import { useState } from 'react';
import { useApp } from '../context/AppContext';
import AdminLogin from '../components/AdminLogin';
import ScheduleTab from '../components/tabs/ScheduleTab';
import TeamsTab from '../components/tabs/TeamsTab';
import SettingsTab from '../components/tabs/SettingsTab';
import PasswordTab from '../components/tabs/PasswordTab';
import { logoutAdmin } from '../services/authService';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const { isAdmin, loading } = useApp();
  const [activeTab, setActiveTab] = useState('schedule');

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>טוען...</div>;
  if (!isAdmin) return <AdminLogin />;

  const tabs = [
    { id: 'schedule', label: 'ניהול לוח' },
    { id: 'teams', label: 'צוותים וחיילים' },
    { id: 'settings', label: 'הגדרות גשר' },
    { id: 'password', label: 'שינוי סיסמה' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: 'var(--accent)' }}>ניהול מערכת</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>חזרה ללוח</Link>
          <button onClick={logoutAdmin} style={{ background: '#991b1b' }}>התנתק</button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid #444', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--military-green)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
              borderRadius: '8px 8px 0 0',
              padding: '10px 20px',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main style={{ background: 'var(--secondary-bg)', padding: 20, borderRadius: 8 }}>
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'teams' && <TeamsTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'password' && <PasswordTab />}
      </main>
    </div>
  );
}
