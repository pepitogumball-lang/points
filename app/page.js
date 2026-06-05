
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';
import AdminUI from './components/AdminUI';

export default async function Home() {
  const points = await kv.get('points') || 0;
  const cookieStore = cookies();
  const isAdmin = cookieStore.get('admin_token')?.value === 'Holaquetalsoypepi5';

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Puntos: {points}</h1>
      
      {/* El punto blanco para admin (meramente visual según el prompt) */}
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '10px', height: '10px', backgroundColor: 'white', borderRadius: '50%' }}></div>

      {isAdmin && <AdminUI currentPoints={points} />}
    </main>
  );
}