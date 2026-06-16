import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword } from 'firebase/auth';
import { auth } from '../firebase';

const ADMIN_EMAIL = 'admin@guard-list.local';

export function loginAdmin(password) {
  return signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
}

export function logoutAdmin() {
  return signOut(auth);
}

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, user => callback(!!user));
}

export function changeAdminPassword(newPassword) {
  return updatePassword(auth.currentUser, newPassword);
}
