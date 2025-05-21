// pages/verify-email.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useReduxHook';
import { setIsAuthenticated } from '@/redux/features/authSlice';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useAppDispatch();
  const [emailVerification, setEmailVerification] = useState({
    verifying: true,
    message: null
  })

  useEffect(() => {
    if (token) {
      fetch(`/api/verify-email?token=${token}`)
        .then(res => res.json())
        .then(data => {
          setEmailVerification({verifying: false, message: data.message || data.error});
          dispatch(setIsAuthenticated(data.status));
          console.log(data.status);
        });
    }
  }, [token]);

  return <div className='flex justify-center w-full min-h-screen text-2xl items-center text-[#1E1B23]'>
    <h1>{emailVerification.verifying ? 'Verifying your email.....' : <p className='flex flex-col space-y-5'>
        <span className='text-xl'>{emailVerification.message}</span>
        <span>You can now exit this page.</span>
      </p>}</h1>
  </div>;
}
