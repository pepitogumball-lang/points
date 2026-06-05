
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAuth() {
  const router = useRouter();

  useEffect(() => {
    // Establecer la cookie (usando JS de cliente para este ejemplo simple)
    document.cookie = "admin_token=Holaquetalsoypepi5; path=/; max-age=31536000";
    
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>success, you are admin now</h1>
      <p>Redirigiendo en 5 segundos...</p>
    </div>
  );
}