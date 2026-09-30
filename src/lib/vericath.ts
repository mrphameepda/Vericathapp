import crypto from 'crypto';

export interface WPPostItem {
  id: number;
  title: string;
  link: string;
  date: string;
  categoryName: string;
  authorName: string;
  imageUrl: string;
  content: string;
}

// In-Memory Cache for WP Posts (5 minutes TTL)
const postCache = new Map<string, { data: WPPostItem[]; timestamp: number }>();
const singlePostCache = new Map<string, { data: WPPostItem | null; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export const cleanHtmlEntities = (text: string) => {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8230;/g, '…')
    .replace(/’/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"');
};

export const cleanArticleContent = (htmlContent: string) => {
  if (!htmlContent) return '';

  let cleaned = htmlContent
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8230;/g, '…')
    .replace(/&nbsp;/g, ' ');

  // Proxy src URLs
  cleaned = cleaned.replace(/src=["'](https:\/\/vericath\.org\/wp-content\/uploads\/[^"']+)["']/g, (_, p1) => {
    return `src="/api/image-proxy?url=${encodeURIComponent(p1)}"`;
  });

  // Proxy srcset URLs
  cleaned = cleaned.replace(/srcset=["']([^"']+)["']/g, (_, p1) => {
    const newSrcset = p1.replace(/https:\/\/vericath\.org\/wp-content\/uploads\/[^\s,]+/g, (url: string) => {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    });
    return `srcset="${newSrcset}"`;
  });

  return cleaned;
};

function checkLeadingZeros(buffer: Buffer, bits: number): boolean {
  const full = Math.floor(bits / 8);
  const rem = bits % 8;
  for (let b = 0; b < full; b++) {
    if (buffer[b] !== 0) return false;
  }
  if (rem > 0 && full < buffer.length) {
    const mask = (0xff << (8 - rem)) & 0xff;
    if ((buffer[full] & mask) !== 0) return false;
  }
  return true;
}

export async function fetchFullPageHTML(url: string, userAgent = 'VericathApp'): Promise<string> {
  try {
    let cookieHeader = '';

    const res = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      next: { revalidate: 300 },
    });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      cookieHeader = setCookie.split(';')[0];
    }

    const text = await res.text();

    if (!text.trim().startsWith('<') || !text.includes('OnePanel Security Check')) {
      return text;
    }

    const nonceMatch = text.match(/var\s+nonce\s*=\s*["']([^"']+)["']/);
    const diffMatch = text.match(/var\s+difficulty\s*=\s*(\d+)/);

    if (!nonceMatch || !diffMatch) return text;

    const nonce = nonceMatch[1];
    const difficulty = parseInt(diffMatch[1], 10);

    let i = 0;
    let solution: string | null = null;

    while (i < 5000000) {
      const solHex = i.toString(16).padStart(16, '0');
      const hash = crypto.createHash('sha256').update(nonce + solHex).digest();
      if (checkLeadingZeros(hash, difficulty)) {
        solution = solHex;
        break;
      }
      i++;
    }

    if (!solution) return text;

    const urlObj = new URL(url);
    const redirect = urlObj.pathname + urlObj.search;
    const challengeUrl = `${urlObj.origin}/_osh/challenge`;

    const body = new URLSearchParams({
      nonce,
      solution,
      redirect,
    }).toString();

    const submitRes = await fetch(challengeUrl, {
      method: 'POST',
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Osh-Fetch': '1',
        'Cookie': cookieHeader,
      },
      body,
    });

    const submitSetCookie = submitRes.headers.get('set-cookie');
    if (submitSetCookie) {
      cookieHeader = submitSetCookie.split(';')[0];
    }

    const finalRes = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': cookieHeader,
      },
      next: { revalidate: 300 },
    });

    return await finalRes.text();
  } catch {
    return '';
  }
}

// Interface for WAF JSON Raw Item
type WAFRawPost = Record<string, unknown> & {
  id?: number;
  title?: { rendered?: string };
  link?: string;
  date?: string;
  content?: { rendered?: string };
  uagb_author_info?: { display_name?: string };
  _embedded?: {
    author?: Array<{ name?: string }>;
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
    'wp:term'?: Array<Array<{ name?: string }>>;
  };
  uagb_featured_image_src?: {
    medium_large?: string[];
    full?: string[];
  };
};

async function fetchWithWAFSolver(url: string, userAgent = 'VericathApp'): Promise<WAFRawPost[]> {
  try {
    let cookieHeader = '';

    const res = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'application/json, text/html, */*',
      },
      next: { revalidate: 300 },
    });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      cookieHeader = setCookie.split(';')[0];
    }

    const text = await res.text();

    if (!text.trim().startsWith('<') && !text.includes('OnePanel Security Check')) {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [parsed];
    }

    const nonceMatch = text.match(/var\s+nonce\s*=\s*["']([^"']+)["']/);
    const diffMatch = text.match(/var\s+difficulty\s*=\s*(\d+)/);

    if (!nonceMatch || !diffMatch) {
      return [];
    }

    const nonce = nonceMatch[1];
    const difficulty = parseInt(diffMatch[1], 10);

    let i = 0;
    let solution: string | null = null;

    while (i < 5000000) {
      const solHex = i.toString(16).padStart(16, '0');
      const hash = crypto.createHash('sha256').update(nonce + solHex).digest();
      if (checkLeadingZeros(hash, difficulty)) {
        solution = solHex;
        break;
      }
      i++;
    }

    if (!solution) {
      return [];
    }

    const urlObj = new URL(url);
    const redirect = urlObj.pathname + urlObj.search;
    const challengeUrl = `${urlObj.origin}/_osh/challenge`;

    const body = new URLSearchParams({
      nonce,
      solution,
      redirect,
    }).toString();

    const submitRes = await fetch(challengeUrl, {
      method: 'POST',
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Osh-Fetch': '1',
        'Cookie': cookieHeader,
      },
      body,
    });

    const submitSetCookie = submitRes.headers.get('set-cookie');
    if (submitSetCookie) {
      cookieHeader = submitSetCookie.split(';')[0];
    }

    const finalRes = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
      next: { revalidate: 300 },
    });

    const finalText = await finalRes.text();

    if (finalText.trim().startsWith('<')) {
      return [];
    }

    const parsedFinal = JSON.parse(finalText);
    return Array.isArray(parsedFinal) ? parsedFinal : [parsedFinal];
  } catch {
    return [];
  }
}

export async function fetchBufferWithWAF(url: string, userAgent = 'VericathApp'): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    let cookieHeader = '';

    const res = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'image/*, */*',
      },
      next: { revalidate: 86400 },
    });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      cookieHeader = setCookie.split(';')[0];
    }

    const contentType = res.headers.get('content-type') || '';

    if (res.ok && contentType.startsWith('image/')) {
      const arrayBuf = await res.arrayBuffer();
      return { buffer: Buffer.from(arrayBuf), contentType };
    }

    const text = await res.text();

    if (text.trim().startsWith('<') || text.includes('OnePanel Security Check')) {
      const nonceMatch = text.match(/var\s+nonce\s*=\s*["']([^"']+)["']/);
      const diffMatch = text.match(/var\s+difficulty\s*=\s*(\d+)/);

      if (!nonceMatch || !diffMatch) return null;

      const nonce = nonceMatch[1];
      const difficulty = parseInt(diffMatch[1], 10);

      let i = 0;
      let solution: string | null = null;

      while (i < 5000000) {
        const solHex = i.toString(16).padStart(16, '0');
        const hash = crypto.createHash('sha256').update(nonce + solHex).digest();
        if (checkLeadingZeros(hash, difficulty)) {
          solution = solHex;
          break;
        }
        i++;
      }

      if (!solution) return null;

      const urlObj = new URL(url);
      const redirect = urlObj.pathname + urlObj.search;
      const challengeUrl = `${urlObj.origin}/_osh/challenge`;

      const body = new URLSearchParams({
        nonce,
        solution,
        redirect,
      }).toString();

      const submitRes = await fetch(challengeUrl, {
        method: 'POST',
        headers: {
          'User-Agent': userAgent,
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Osh-Fetch': '1',
          'Cookie': cookieHeader,
        },
        body,
      });

      const submitSetCookie = submitRes.headers.get('set-cookie');
      if (submitSetCookie) {
        cookieHeader = submitSetCookie.split(';')[0];
      }

      const finalRes = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'image/*, */*',
          'Cookie': cookieHeader,
        },
        next: { revalidate: 86400 },
      });

      if (!finalRes.ok) return null;

      const finalContentType = finalRes.headers.get('content-type') || 'image/jpeg';
      const arrayBuf = await finalRes.arrayBuffer();
      return { buffer: Buffer.from(arrayBuf), contentType: finalContentType };
    }

    return null;
  } catch {
    return null;
  }
}

export async function getVericathPosts(categoryIds: string, perPage = 10, priorityCategoryId?: string): Promise<WPPostItem[]> {
  const cacheKey = `${categoryIds}_${perPage}_${priorityCategoryId || ''}`;
  const now = Date.now();

  const cached = postCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const rawPosts: WAFRawPost[] = [];

    if (priorityCategoryId) {
      const priorityUrl = `https://vericath.org/wp-json/wp/v2/posts?categories=${priorityCategoryId}&per_page=${perPage}&_embed`;
      const otherCategoryIds = categoryIds.split(',').filter(id => id.trim() !== priorityCategoryId).join(',');
      const otherUrl = otherCategoryIds
        ? `https://vericath.org/wp-json/wp/v2/posts?categories=${otherCategoryIds}&per_page=${perPage}&_embed`
        : null;

      const [priorityPosts, otherPosts] = await Promise.all([
        fetchWithWAFSolver(priorityUrl, 'VericathApp'),
        otherUrl ? fetchWithWAFSolver(otherUrl, 'VericathApp') : Promise.resolve([]),
      ]);

      const seenIds = new Set<number>();
      for (const p of priorityPosts) {
        if (p?.id && !seenIds.has(p.id)) {
          seenIds.add(p.id);
          rawPosts.push(p);
        }
      }
      for (const p of otherPosts) {
        if (p?.id && !seenIds.has(p.id) && rawPosts.length < perPage) {
          seenIds.add(p.id);
          rawPosts.push(p);
        }
      }
    } else {
      const url = `https://vericath.org/wp-json/wp/v2/posts?categories=${categoryIds}&per_page=${perPage}&_embed`;
      const fetched = await fetchWithWAFSolver(url, 'VericathApp');
      rawPosts.push(...fetched);
    }

    if (!Array.isArray(rawPosts)) return [];

    const result: WPPostItem[] = rawPosts.map((post) => {
      const author = post.uagb_author_info?.display_name || post._embedded?.author?.[0]?.name || 'Vericath Editor';
      const rawImage =
        post.uagb_featured_image_src?.medium_large?.[0] ||
        post.uagb_featured_image_src?.full?.[0] ||
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

      const proxiedImage = rawImage.startsWith('https://vericath.org/')
        ? `/api/image-proxy?url=${encodeURIComponent(rawImage)}`
        : rawImage;

      const cat = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Chuyên mục';

      return {
        id: post.id || 0,
        title: cleanHtmlEntities(post.title?.rendered || ''),
        link: post.link || '#',
        date: post.date || '',
        categoryName: cleanHtmlEntities(cat),
        authorName: cleanHtmlEntities(author),
        imageUrl: proxiedImage,
        content: cleanArticleContent(post.content?.rendered || ''),
      };
    });

    postCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch {
    return [];
  }
}

export async function getSingleVericathPost(postUrlOrId: string): Promise<WPPostItem | null> {
  const cacheKey = postUrlOrId;
  const now = Date.now();

  const cached = singlePostCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    let url = '';
    if (postUrlOrId.startsWith('http')) {
      const urlObj = new URL(postUrlOrId);
      const pathname = urlObj.pathname.replace(/^\/|\/$/g, '');
      const parts = pathname.split('/');
      const slug = parts[parts.length - 1];
      url = `https://vericath.org/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`;
    } else {
      url = `https://vericath.org/wp-json/wp/v2/posts/${postUrlOrId}?_embed`;
    }

    const data = await fetchWithWAFSolver(url, 'VericathApp');
    const post: WAFRawPost | undefined = data[0];

    if (!post || !post.id) return null;

    const author = post.uagb_author_info?.display_name || post._embedded?.author?.[0]?.name || 'Vericath Editor';
    const rawImage =
      post.uagb_featured_image_src?.medium_large?.[0] ||
      post.uagb_featured_image_src?.full?.[0] ||
      post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

    const proxiedImage = rawImage.startsWith('https://vericath.org/')
      ? `/api/image-proxy?url=${encodeURIComponent(rawImage)}`
      : rawImage;

    const cat = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Chuyên mục';

    const result: WPPostItem = {
      id: post.id,
      title: cleanHtmlEntities(post.title?.rendered || ''),
      link: post.link || '#',
      date: post.date || '',
      categoryName: cleanHtmlEntities(cat),
      authorName: cleanHtmlEntities(author),
      imageUrl: proxiedImage,
      content: cleanArticleContent(post.content?.rendered || ''),
    };

    singlePostCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch {
    return null;
  }
}
