
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const isAdmin = cookies().get('admin_token')?.value === 'Holaquetalsoypepi5';
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { points } = await req.json();
  await kv.set('points', points);
  return NextResponse.json({ success: true });
}