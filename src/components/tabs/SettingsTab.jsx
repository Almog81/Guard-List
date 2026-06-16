import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { saveSettings } from '../../services/settingsService';

export default function SettingsTab() {
  const { settings, regen } = useApp();
  const [localSettings, setLocalSettings] = useState(null);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  if (!localSettings) return null;

  const handleSave = async () => {
    await saveSettings(localSettings);
    if (window.confirm('הגדרות נשמרו. האם לעדכן את הלוח בהתאם?')) {
      await regen();
    }
  };

  const handleChange = (key, val) => {
    setLocalSettings({ ...localSettings, [key]: parseFloat(val) });
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 20 }}>הגדרות שעות גשר</h3>
      
      <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>תחילת גשר בוקר</label>
          <input type="number" step="0.5" value={localSettings.morningBridgeStart} onChange={e => handleChange('morningBridgeStart', e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>סיום גשר בוקר</label>
          <input type="number" step="0.5" value={localSettings.morningBridgeEnd} onChange={e => handleChange('morningBridgeEnd', e.target.value)} style={{ width: '100%' }} />
        </div>
        <hr style={{ border: '0.5px solid #444', margin: '8px 0' }} />
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>תחילת גשר ערב</label>
          <input type="number" step="0.5" value={localSettings.eveningBridgeStart} onChange={e => handleChange('eveningBridgeStart', e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>סיום גשר ערב</label>
          <input type="number" step="0.5" value={localSettings.eveningBridgeEnd} onChange={e => handleChange('eveningBridgeEnd', e.target.value)} style={{ width: '100%' }} />
        </div>
      </div>

      <button onClick={handleSave} style={{ width: '100%', padding: 12 }}>שמור הגדרות</button>
      
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 12 }}>
        * שעות מוזנות כעשרוני (למשל 6.5 עבור 06:30)
      </p>
    </div>
  );
}
