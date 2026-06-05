'use client';
import { useState } from 'react';

export default function AdminUI({ currentPoints }) {
  const [p, setP] = useState(currentPoints);
  const u = async (v) => { setP(v); await fetch('/api/points', { method: 'POST', body: JSON.stringify({ points: v }) }); };
  return ( <div className='bg-slate-900 p-4'> <button onClick={()=>u(p+1)} className='bg-cyan-600 p-4 w-full mb-2'>+1</button> <button onClick={()=>u(p-1)} className='bg-red-600 p-4 shadow-xl w-full'>-1</button> </div> );
}