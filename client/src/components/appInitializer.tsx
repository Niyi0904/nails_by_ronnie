'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { useAppDispatch } from '@/hooks/useReduxHook';
import { setUser, logout, setIsLoading } from '@/redux/features/authSlice';
import api from '@/utils/api';

export default function AppInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkSession = async () => {
      dispatch(setIsLoading(true));
      try {
        const res = await api.get('/auth/current-user'); // axios automatically parses JSON
        const data = res.data;

        if (data.user) {
          dispatch(setUser(data.user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    checkSession();
  }, []);

  return null; // This component just runs session logic
}
