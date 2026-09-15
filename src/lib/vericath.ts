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
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

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
  cleaned = cleaned.replace(/src=["'](https:\/\/vericath\.org\/wp-content\/uploads\/[^"']+)["']/g, (match, p1) => {
    return `src="/api/image-proxy?url=${encodeURIComponent(p1)}"`;
  });

  // Proxy srcset URLs
  cleaned = cleaned.replace(/srcset=["']([^"']+)["']/g, (match, p1) => {
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

    let res = await fetch(url, {
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

    let text = await res.text();

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
      nonce: nonce,
      solution: solution,
      redirect: redirect,
    }).toString();

    const submitRes = await fetch(challengeUrl, {
      method: 'POST',
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Osh-Fetch': '1',
        'Cookie': cookieHeader,
      },
      body: body,
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
  } catch (error) {
    console.error('Error in fetchFullPageHTML:', error);
    return '';
  }
}

async function fetchWithWAFSolver(url: string, userAgent = 'VericathApp'): Promise<any[]> {
  try {
    let cookieHeader = '';

    // Step 1: Request target URL
    let res = await fetch(url, {
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

    let text = await res.text();

    // If valid JSON response, return immediately
    if (!text.trim().startsWith('<') && !text.includes('OnePanel Security Check')) {
      return JSON.parse(text);
    }

    // Step 2: OnePanel WAF Challenge detected - solve PoW
    const nonceMatch = text.match(/var\s+nonce\s*=\s*["']([^"']+)["']/);
    const diffMatch = text.match(/var\s+difficulty\s*=\s*(\d+)/);

    if (!nonceMatch || !diffMatch) {
      console.warn('WAF Challenge detected but nonce/difficulty missing from HTML');
      return [];
    }

    const nonce = nonceMatch[1];
    const difficulty = parseInt(diffMatch[1], 10);

    let i = 0;
    let solution: string | null = null;

    // Solve SHA-256 PoW challenge (~4ms)
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
      console.warn('WAF PoW solution search exceeded limit');
      return [];
    }

    // Step 3: Submit solution to WAF endpoint /_osh/challenge
    const urlObj = new URL(url);
    const redirect = urlObj.pathname + urlObj.search;
    const challengeUrl = `${urlObj.origin}/_osh/challenge`;

    const body = new URLSearchParams({
      nonce: nonce,
      solution: solution,
      redirect: redirect,
    }).toString();

    const submitRes = await fetch(challengeUrl, {
      method: 'POST',
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Osh-Fetch': '1',
        'Cookie': cookieHeader,
      },
      body: body,
    });

    const submitSetCookie = submitRes.headers.get('set-cookie');
    if (submitSetCookie) {
      cookieHeader = submitSetCookie.split(';')[0];
    }

    // Step 4: Re-fetch original URL with new session cookie
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
      console.warn('Received HTML response after WAF challenge submission');
      return [];
    }

    return JSON.parse(finalText);
  } catch (error) {
    console.error('Error during fetchWithWAFSolver:', error);
    return [];
  }
}

export async function fetchBufferWithWAF(url: string, userAgent = 'VericathApp'): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    let cookieHeader = '';

    let res = await fetch(url, {
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

    let text = await res.text();

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
        nonce: nonce,
        solution: solution,
        redirect: redirect,
      }).toString();

      const submitRes = await fetch(challengeUrl, {
        method: 'POST',
        headers: {
          'User-Agent': userAgent,
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Osh-Fetch': '1',
          'Cookie': cookieHeader,
        },
        body: body,
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
  } catch (error) {
    console.error('Error fetching image buffer with WAF:', error);
    return null;
  }
}

export async function getVericathPosts(categoryIds: string, perPage = 10, priorityCategoryId?: string): Promise<WPPostItem[]> {
  const cacheKey = `${categoryIds}_${perPage}_${priorityCategoryId || ''}`;
  const now = Date.now();

  // 1. Check in-memory cache
  const cached = postCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    let rawPosts: any[] = [];

    if (priorityCategoryId) {
      // Parallel fetch for priority category and other categories
      const priorityUrl = `https://vericath.org/wp-json/wp/v2/posts?categories=${priorityCategoryId}&per_page=${perPage}&_embed`;
      const otherCategoryIds = categoryIds.split(',').filter(id => id.trim() !== priorityCategoryId).join(',');
      const otherUrl = otherCategoryIds
        ? `https://vericath.org/wp-json/wp/v2/posts?categories=${otherCategoryIds}&per_page=${perPage}&_embed`
        : null;

      const [priorityPosts, otherPosts] = await Promise.all([
        fetchWithWAFSolver(priorityUrl, 'VericathApp'),
        otherUrl ? fetchWithWAFSolver(otherUrl, 'VericathApp') : Promise.resolve([]),
      ]);

      // Combine priority posts first, then other posts (deduplicated by id)
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
      rawPosts = await fetchWithWAFSolver(url, 'VericathApp');
    }

    if (!Array.isArray(rawPosts)) return [];

    const result: WPPostItem[] = rawPosts.map((post: any) => {
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
        id: post.id,
        title: cleanHtmlEntities(post.title?.rendered || ''),
        link: post.link,
        date: post.date,
        categoryName: cleanHtmlEntities(cat),
        authorName: cleanHtmlEntities(author),
        imageUrl: proxiedImage,
        content: cleanArticleContent(post.content?.rendered || ''),
      };
    });

    // Store in cache
    postCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch (error) {
    console.error('Error fetching live vericath posts:', error);
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
    const post = Array.isArray(data) ? data[0] : data;

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
      link: post.link,
      date: post.date,
      categoryName: cleanHtmlEntities(cat),
      authorName: cleanHtmlEntities(author),
      imageUrl: proxiedImage,
      content: cleanArticleContent(post.content?.rendered || ''),
    };

    singlePostCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch (error) {
    console.error('Error fetching single vericath post:', error);
    return null;
  }
}
