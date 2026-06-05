
import { list } from '@vercel/blob';
import { cookies } from 'next/headers';
import AdminUI from './components/AdminUI';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let points = 0;
  
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { blobs } = await list({ prefix: 'points.json', limit: 1 });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        const data = await response.json();
        points = data.points || 0;
      }
    }
  } catch (e) {
    console.error('Blob Error:', e);
  }
  
  const cookieStore = cookies();
  const isAdmin = cookieStore.get('admin_token')?.value === 'Holaquetalsoypepi5';

  return (
    <main className='flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-slate-950 text-white'>
      <div className='text-center z-10'>
        <h1 className='text-6xl font-black tracking-tighter mb-2 uppercase'>Puntos</h1>
        <div className='text-8xl font-mono text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]'>
          {points}
        </div>
      </div>
      <div className='absolute bottom-4 right-4 w-2 h-2 bg-white/20 rounded-full'></div>
      {isAdmin && (
        <div className='mt-12 w-full max-w-md p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl z-20'>
          <AdminUI currentPoints={points} />
        </div>
      )}
    </main>
  );
}
