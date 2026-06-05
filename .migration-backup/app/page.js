'use client';
import { useState, useEffect } from 'react';
import AdminUI from './components/AdminUI';

export default function Home() {
  const [points, setPoints] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchPoints = async () => {
    try {
      const res = await fetch('/api/points');
      const data = await res.json();
      setPoints(data.points || 0);
      setIsAdmin(document.cookie.includes('admin_token=Holaquetalsoypepi5'));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchPoints();
    const interval = setInterval(fetchPoints, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className='min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-white relative overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent'></div>
      <div className='z-10 text-center space-y-12'>
        <h1 className='text-8xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500'>Puntos</h1>
        <div className='bg-black/40 backdrop-blur-md border border-white/10 px-16 py-8 rounded-full shadow-[0_0_50px_rgba(34,211,238,0.2)]'>
          <span className='text-9xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]'>{points}</span>
        </div>
      </div>
      {isAdmin && <div className='mt-12 w-full max-w-sm z-20'><AdminUI currentPoints={points} onUpdate={setPoints} /></div>}
    </main>
  );
}