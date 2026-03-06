import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, { cache: 'force-cache' });
    
    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*', // CRITICAL: This allows Canvas getImageData locally
      },
    });

  } catch (error) {
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
