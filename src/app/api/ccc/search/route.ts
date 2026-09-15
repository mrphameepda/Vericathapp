import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedData: any = null; // force reload

function getCCCData() {
  if (cachedData) return cachedData;
  const filePath = path.join(process.cwd(), 'public', 'giao-ly-cong-giao', 'ccc-data.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  cachedData = JSON.parse(fileContents);
  return cachedData;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const data = getCCCData();
    const lookup = data.lookup;
    const normalizedQuery = query.toLowerCase().trim();

    const results = [];
    let count = 0;

    // Simple search: iterate through lookup
    for (const key in lookup) {
      const item = lookup[key];
      const searchText = (item.search_text || '').toLowerCase();
      const text = (item.text || '').toLowerCase();
      
      if (searchText.includes(normalizedQuery) || text.includes(normalizedQuery)) {
        // Extract a snippet around the match
        let snippet = item.text || '';
        if (snippet.length > 200) {
          const matchIndex = snippet.toLowerCase().indexOf(normalizedQuery);
          if (matchIndex !== -1) {
            const start = Math.max(0, matchIndex - 80);
            const end = Math.min(snippet.length, matchIndex + normalizedQuery.length + 80);
            snippet = (start > 0 ? '...' : '') + snippet.substring(start, end) + (end < snippet.length ? '...' : '');
          } else {
             snippet = snippet.substring(0, 200) + '...';
          }
        }

        results.push({
          number: item.number,
          heading: item.heading,
          path: item.path,
          slug: item.slug,
          snippet
        });
        
        count++;
        // Limit results to 50 for performance
        if (count >= 50) break;
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching CCC:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
