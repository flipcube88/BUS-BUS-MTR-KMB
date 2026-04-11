import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export type FavoriteKmb = {
  id: string;
  route: string;
  bound: 'inbound' | 'outbound';
  orig_tc: string;
  dest_tc: string;
  stopId?: string;
  stopName?: string;
};

export type FavoriteCtb = {
  id: string;
  route: string;
  bound: 'inbound' | 'outbound';
  orig_tc: string;
  dest_tc: string;
  stopId?: string;
  stopName?: string;
};

export type FavoriteMtr = {
  id: string;
  line: string;
  station: string;
  lineName: string;
  stationName: string;
  color: string;
};

export function useFavorites() {
  const [kmbFavs, setKmbFavs] = useState<FavoriteKmb[]>(() => {
    try {
      const saved = localStorage.getItem('kmb_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [ctbFavs, setCtbFavs] = useState<FavoriteCtb[]>(() => {
    try {
      const saved = localStorage.getItem('ctb_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mtrFavs, setMtrFavs] = useState<FavoriteMtr[]>(() => {
    try {
      const saved = localStorage.getItem('mtr_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    if (userId) {
      // Sync from Firebase
      const userDocRef = doc(db, 'users', userId);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.kmbFavs) setKmbFavs(data.kmbFavs);
          if (data.ctbFavs) setCtbFavs(data.ctbFavs);
          if (data.mtrFavs) setMtrFavs(data.mtrFavs);
        } else {
          // Initialize document if it doesn't exist
          setDoc(userDocRef, { kmbFavs, ctbFavs, mtrFavs }, { merge: true });
        }
      }, (error) => {
        console.error("Error fetching favorites:", error);
      });
      return () => unsubscribe();
    } else {
      // Fallback to local storage if not logged in
      try {
        const savedKmb = localStorage.getItem('kmb_favs');
        if (savedKmb) setKmbFavs(JSON.parse(savedKmb));
        const savedCtb = localStorage.getItem('ctb_favs');
        if (savedCtb) setCtbFavs(JSON.parse(savedCtb));
        const savedMtr = localStorage.getItem('mtr_favs');
        if (savedMtr) setMtrFavs(JSON.parse(savedMtr));
      } catch (e) {
        console.error(e);
      }
    }
  }, [userId, isAuthReady]);

  // Sync to local storage and Firebase when state changes
  useEffect(() => {
    if (!isAuthReady) return;
    localStorage.setItem('kmb_favs', JSON.stringify(kmbFavs));
    localStorage.setItem('ctb_favs', JSON.stringify(ctbFavs));
    localStorage.setItem('mtr_favs', JSON.stringify(mtrFavs));

    if (userId) {
      const userDocRef = doc(db, 'users', userId);
      setDoc(userDocRef, { kmbFavs, ctbFavs, mtrFavs }, { merge: true }).catch(e => console.error("Error saving to Firebase", e));
    }
  }, [kmbFavs, ctbFavs, mtrFavs, userId, isAuthReady]);

  const toggleKmbFav = (fav: FavoriteKmb) => {
    setKmbFavs(prev => {
      const exists = prev.some(f => f.id === fav.id);
      if (exists) return prev.filter(f => f.id !== fav.id);
      return [...prev, fav];
    });
  };

  const toggleCtbFav = (fav: FavoriteCtb) => {
    setCtbFavs(prev => {
      const exists = prev.some(f => f.id === fav.id);
      if (exists) return prev.filter(f => f.id !== fav.id);
      return [...prev, fav];
    });
  };

  const toggleMtrFav = (fav: FavoriteMtr) => {
    setMtrFavs(prev => {
      const exists = prev.some(f => f.id === fav.id);
      if (exists) return prev.filter(f => f.id !== fav.id);
      return [...prev, fav];
    });
  };

  const isKmbFav = (id: string) => kmbFavs.some(f => f.id === id);
  const isCtbFav = (id: string) => ctbFavs.some(f => f.id === id);
  const isMtrFav = (id: string) => mtrFavs.some(f => f.id === id);

  return { kmbFavs, ctbFavs, mtrFavs, toggleKmbFav, toggleCtbFav, toggleMtrFav, isKmbFav, isCtbFav, isMtrFav };
}
