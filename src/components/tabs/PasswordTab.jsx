import { useState } from 'react';
import { changeAdminPassword } from '../../services/authService';

export default function PasswordTab() {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleUpdate = async () => {
    if (newPass.length < 6) {
      setMsg({ text: 'סיסמה חייבת להיות לפחות 6 תווים', type: 'error' });
      return;
    }
    if (newPass !== confirmPass) {
      setMsg({ text: 'סיסמאות לא תואמות', type: 'error' });
      return;
    }

    try {
      await changeAdminPassword(newPass);
      setMsg({ text: 'סיסמה עודכנה בהצלחה', type: 'success' });
      setNewPass('');
      setConfirmPass('');
    } catch (e) {
      setMsg({ text: 'שגיאה בעדכון סיסמה', type: 'error' });
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 20 }}>שינוי סיסמת אדמין</h3>
      
      <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
        <input 
          type="password" 
          placeholder="סיסמה חדשה" 
          value={newPass} 
          onChange={e => setNewPass(e.target.value)} 
          style={{ width: '100%' }}
        />
        <input 
          type="password" 
          placeholder="אימות סיסמה" 
          value={confirmPass} 
          onChange={e => setConfirmPass(e.target.value)} 
          style={{ width: '100%' }}
        />
      </div>

      {msg.text && (
        <div style={{ 
          marginBottom: 16, 
          color: msg.type === 'error' ? '#f87171' : '#4ade80',
          fontSize: '0.9rem'
        }}>
          {msg.text}
        </div>
      )}

      <button onClick={handleUpdate} style={{ width: '100%', padding: 12 }}>עדכן סיסמה</button>
    </div>
  );
}
