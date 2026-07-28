'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { auth, db } from '@/lib/Firebase/firebaseUtils';
import { useAppDispatch } from '@/hooks/useReduxHook';
import { setUser, logout, setIsLoading, User } from '@/redux/features/authSlice';
import { GetUserData } from '@/functions/getUserData/getUserData';

/**
 * AppInitializer
 *
 * Replaces the previous backend-session approach with a Firebase-native
 * onAuthStateChanged listener. This is the single source of truth for
 * authentication state across the entire application.
 *
 * Key changes from previous version:
 *  - No backend API call (/auth/current-user removed)
 *  - Uses Firebase UID as the user document ID (not email)
 *  - Cleans up the listener on unmount to prevent memory leaks
 *  - No localStorage race condition — Firebase handles session persistence
 */
export default function AppInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setIsLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Use UID as the document key — never email
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userData = await GetUserData(userDocRef);

          if (userData) {
            const user: User = {
              userId: userData.UserId || firebaseUser.uid,
              full_name: userData.full_name,
              email: userData.email,
              phone_number: userData.phoneNumber,
              address: userData.address,
              role: userData.role,
              profilePicture: userData.profilePicture,
            };
            dispatch(setUser(user));
          } else {
            // Firestore doc doesn't exist yet (e.g. new signup in progress)
            dispatch(logout());
          }
        } catch (error) {
          console.error('AppInitializer: Failed to load user profile', error);
          dispatch(logout());
        }
      } else {
        // No Firebase session — user is logged out
        dispatch(logout());
      }

      dispatch(setIsLoading(false));
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, [dispatch]);

  return null;
}