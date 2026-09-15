import { NextRequest, NextResponse } from 'next/server';
import { fetchBufferWithWAF } from '@/lib/vericath';

const imageCache = new Map<string, { buffer: Uint8Array; contentType: string; timestamp: number }>();
const MAX_IMAGE_CACHE = 200;
const IMAGE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl || !imageUrl.startsWith('https://vericath.org/')) {
    return new NextResponse('Invalid or missing image URL', { status: 400 });
  }

  const now = Date.now();
  const cached = imageCache.get(imageUrl);

  // Return from RAM cache if valid
  if (cached && now - cached.timestamp < IMAGE_CACHE_TTL_MS) {
    return new NextResponse(cached.buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': cached.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  }

  try {
    const result = await fetchBufferWithWAF(imageUrl);

    if (!result || !result.buffer) {
      return new NextResponse('Failed to fetch image from host', { status: 502 });
    }

    const uint8Buf = new Uint8Array(result.buffer);

    // Maintain cache size
    if (imageCache.size >= MAX_IMAGE_CACHE) {
      const oldestKey = imageCache.keys().next().value;
      if (oldestKey) imageCache.delete(oldestKey);
    }

    imageCache.set(imageUrl, {
      buffer: uint8Buf,
      contentType: result.contentType || 'image/jpeg',
      timestamp: now,
    });

    return new NextResponse(uint8Buf as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': result.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
