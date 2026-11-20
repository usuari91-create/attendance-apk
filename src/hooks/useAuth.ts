import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { getAuthInstance } from '../config/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
      } else {
        // Auto sign in anonymously for demo
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.error('Anonymous sign in failed:', e);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(getAuthInstance());

  return { user, loading, logout };
}