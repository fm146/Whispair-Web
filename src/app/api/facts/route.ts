import { NextResponse } from 'next/server';
import { API_URL, API_KEY } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  // Use the same logic as fetchFromApi in lib/api.ts but on the server
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "track_facts");
    url.searchParams.append("key", API_KEY);
    url.searchParams.append("title", title);

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    
    if (!res.ok) {
        return NextResponse.json({ error: 'Backend error' }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    console.error("Facts Proxy error:", error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
