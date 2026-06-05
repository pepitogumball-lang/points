'use client';
import { useState } from 'react';

export default function AdminUI({ currentPoints, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const adjust = async (delta) => {
    if (loading) return;
    setLoading(true);
    const next = currentPoints + delta;
    onUpdate(next);
    try {
      await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: next }),
      });
    } catch(e) {
      console.error(e);
      onUpdate(currentPoints);
    } finally { setLoading(false); }
  };

  return (
    <div className='bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl'>
      <h3 className='text-white/40 text-xs font-bold tracking-widest uppercase mb-4'>Admin Control</h3>
      <div className='grid grid-cols-2 gap-4'>
        <button onClick={() => adjust(1)} className='h-20 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-3xl transition-all active:scale-95'>+1</button>
        <button onClick={() => adjust(-1)} className='h-20 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-3xl border border-white/10 transition-all active:scale-95'>-1</button>
      </div>
    </div>
  );
}