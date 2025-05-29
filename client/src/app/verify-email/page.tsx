// app/verify-email/[token]/page.tsx
import { Suspense } from 'react';
import EmailVerifier from '@/components/emailVerifyer';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <EmailVerifier />
    </Suspense>
  );
}
