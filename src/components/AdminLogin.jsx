import { useState } from 'react';
import { loginAdmin } from '../services/authService';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      await loginAdmin(password);
    } catch (e) {
      setError('סיסמה שגויה או שגיאת חיבור');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{ 
        background: 'var(--secondary-bg)', 
        padding: 32, 
        borderRadius: 12, 
        width: '100%', 
        maxWidth: 400,
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: 24 }}>כניסת מנהל</h2>
        <div style={{ marginBottom: 16 }}>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="סיסמת אדמין"
            style={{ width: '100%', padding: 12, fontSize: '1.1rem' }}
            autoFocus
          />
        </div>
        {error && <div style={{ color: '#f87171', marginBottom: 16, fontSize: '0.9rem' }}>{error}</div>}
        <button 
          onClick={handleLogin} 
          disabled={loading}
          style={{ width: '100%', padding: 12, fontSize: '1.1rem' }}
        >
          {loading ? 'מתחבר...' : 'כניסה'}
        </button>
      </div>
    </div>
  );
}
