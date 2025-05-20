import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Firebase setup voor real-time updates
export const initRealtime = (setSpeelpleinData) => {
  const db = getDatabase();
  const speelpleinenRef = ref(db, 'speelpleinen');
  
  onValue(speelpleinenRef, (snapshot) => {
    const data = snapshot.val();
    setSpeelpleinData(data);
  });
}; 