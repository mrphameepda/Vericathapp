import { NextRequest, NextResponse } from 'next/server';
import { fetchFullPageHTML } from '@/lib/vericath';

const pageCache = new Map<string, { html: string; timestamp: number }>();
const MAX_PAGE_CACHE = 50;
const PAGE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const ALLOWED_DOMAINS = ['vericath.org', 'kpv.vn'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Invalid or missing URL', { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return new NextResponse('Invalid or missing URL', { status: 400 });
  }

  const isAllowed = ALLOWED_DOMAINS.some(
    (domain) => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith('.' + domain)
  );

  if (!isAllowed) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  const now = Date.now();
  const cached = pageCache.get(targetUrl);

  // Return cached HTML if valid
  if (cached && now - cached.timestamp < PAGE_CACHE_TTL_MS) {
    return new NextResponse(cached.html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=600',
      },
    });
  }

  try {
    let html = await fetchFullPageHTML(targetUrl);

    if (!html) {
      return new NextResponse('Failed to fetch page', { status: 502 });
    }

    const baseOrigin = parsedUrl.origin + '/';

    // Insert <base href="..." /> after <head>
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head><base href="${baseOrigin}" />`);
    } else if (html.includes('<HEAD>')) {
      html = html.replace('<HEAD>', `<HEAD><base href="${baseOrigin}" />`);
    }

    // Proxy image uploads through our /api/image-proxy for vericath.org
    if (parsedUrl.hostname.includes('vericath.org')) {
      html = html.replace(/src=["'](https:\/\/vericath\.org\/wp-content\/uploads\/[^"']+)["']/g, (match, p1) => {
        return `src="/api/image-proxy?url=${encodeURIComponent(p1)}"`;
      });
    }

    // Maintain cache size
    if (pageCache.size >= MAX_PAGE_CACHE) {
      const oldestKey = pageCache.keys().next().value;
      if (oldestKey) pageCache.delete(oldestKey);
    }

    pageCache.set(targetUrl, { html, timestamp: now });

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=600',
      },
    });
  } catch (error) {
    console.error('Page proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
