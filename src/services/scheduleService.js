import { doc, setDoc, getDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { generateSchedule } from '../scheduler';

function dateStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

// Real-time listener for a range of days (14 individual doc listeners merged)
export function watchSchedule(days, callback) {
  const unsubs = [];
  const result = {};

  for (let i = 0; i < days; i++) {
    const date = dateStr(i);
    const unsub = onSnapshot(doc(db, 'schedule', date), (snap) => {
      result[date] = snap.exists() ? snap.data().slots : null;
      callback({ ...result });
    });
    unsubs.push(unsub);
  }

  return () => unsubs.forEach(u => u());
}

export async function regenerateSchedule(teams, settings, days = 14) {
  const allSoldiers = teams.flatMap(t => t.soldiers.map(s => ({
    ...s, teamId: t.id, teamName: t.name, teamColor: t.color,
  })));
  const teamsWithSoldiers = teams.map(t => ({
    ...t,
    soldiers: allSoldiers.filter(s => s.teamId === t.id),
  }));

  const schedule = generateSchedule(teamsWithSoldiers, settings, days, dateStr);

  const batch = writeBatch(db);
  for (const day of schedule) {
    batch.set(doc(db, 'schedule', day.date), { slots: day.slots });
  }
  await batch.commit();
}

export async function overrideSlot(date, slotT, soldier) {
  const ref = doc(db, 'schedule', date);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const slots = snap.data().slots.map(s =>
    s.t === slotT
      ? { ...s, soldierId: soldier.id, soldierName: soldier.name, teamId: soldier.teamId, teamName: soldier.teamName, teamColor: soldier.teamColor, isOverride: true }
      : s
  );
  await setDoc(ref, { slots });
}

export { dateStr };
