import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export function watchTeams(callback) {
  const teamsQuery = query(collection(db, 'teams'), orderBy('sortOrder'));
  return onSnapshot(teamsQuery, (snap) => {
    const teams = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(teams);
  });
}

export function watchSoldiers(callback) {
  return onSnapshot(collection(db, 'soldiers'), (snap) => {
    const soldiers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(soldiers);
  });
}

export async function saveTeam(team) {
  await setDoc(doc(db, 'teams', team.id), {
    name: team.name, color: team.color, sortOrder: team.sortOrder ?? 0,
  });
}

export async function deleteTeam(teamId) {
  await deleteDoc(doc(db, 'teams', teamId));
}

export async function saveSoldier(soldier) {
  await setDoc(doc(db, 'soldiers', soldier.id), {
    teamId: soldier.teamId, name: soldier.name, active: true,
  });
}

export async function deleteSoldier(soldierId) {
  await deleteDoc(doc(db, 'soldiers', soldierId));
}
