
'use client';
import { useState, useEffect, useRef } from 'react';

export default function AdminUI({ currentPoints }) {
  const [points, setPoints] = useState(currentPoints);
  const intervalRef = useRef(null);

  const updatePoints = async (newPoints) => {
    setPoints(newPoints);
    await fetch('/api/points', {
      method: 'POST',
      body: JSON.stringify({ points: newPoints }),
    });
  };

  const startAdjust = (delta) => {
    updatePoints(points + delta);
    intervalRef.current = setInterval(() => {
      setPoints(prev => {
        const next = prev + delta;
        fetch('/api/points', { method: 'POST', body: JSON.stringify({ points: newPoints } ) });
        return next;
      });
    }, 100);
  };

  const stopAdjust = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}>
      <h3>Panel de Admin</h3>
      <input 
        type="number" 
        value={points} 
        onChange={(e) => updatePoints(parseInt(e.target.value) || 0)}
        style={{ padding: '8px', marginBottom: '10px', display: 'block' }}
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onMouseDown={() => startAdjust(1)} 
          onMouseUp={stopAdjust} 
          onMouseLeave={stopAdjust}
          style={{ padding: '10px 20px' }}
        >
          +
        </button>
        <button 
          onMouseDown={() => startAdjust(-1)} 
          onMouseUp={stopAdjust} 
          onMouseLeave={stopAdjust}
          style={{ padding: '10px 20px' }}
        >
          -
        </button>
      </div>
    </div>
  );
}