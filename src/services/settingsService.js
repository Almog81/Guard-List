import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SETTINGS_DOC = doc(db, 'settings', 'bridgeTimes');

const DEFAULTS = {
  morningBridgeStart: 6, morningBridgeEnd: 8,
  eveningBridgeStart: 18, eveningBridgeEnd: 20,
};

export function watchSettings(callback) {
  return onSnapshot(SETTINGS_DOC, (snap) => {
    callback(snap.exists() ? snap.data() : DEFAULTS);
  });
}

export async function ensureDefaultSettings() {
  const snap = await getDoc(SETTINGS_DOC);
  if (!snap.exists()) await setDoc(SETTINGS_DOC, DEFAULTS);
}

export async function saveSettings(settings) {
  await setDoc(SETTINGS_DOC, settings, { merge: true });
}
