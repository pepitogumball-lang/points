
import { put } from '@vercel/blob';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const isAdmin = cookies().get('admin_token')?.value === 'Holaquetalsoypepi5';
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { points } = await req.json();
    await put('points.json', JSON.stringify({ points }), {
      access: 'public',
      addRandomSuffix: false,
    });
    return NextResponse.json({ success: true, points });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
