import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'giao-ly-cong-giao', 'ccc-menu.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading CCC menu:', error);
    return NextResponse.json({ error: 'Failed to load menu' }, { status: 500 });
  }
}
