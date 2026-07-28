export function logFirebaseError(context: string, error: unknown): void {
  const err = error as any;
  console.group(`%c🔥 Firebase Error [${context}]`, 'color: #ff4444; font-weight: bold');
  if (err?.code) console.error('Code:', err.code);
  if (err?.message) console.error('Message:', err.message);
  if (err?.name) console.error('Name:', err.name);
  if (err?.customData) console.error('CustomData:', err.customData);
  if (err?.stack) console.error('Stack:', err.stack);
  console.groupEnd();
}
