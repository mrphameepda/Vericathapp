import { NextResponse } from 'next/server';
import { getDayLiturgy, getWeekLiturgy, getYearData } from '@/lib/liturgy';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const weekOf = searchParams.get('week_of');
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  try {
    // 1. Single Date Query
    if (date) {
      const dayData = getDayLiturgy(date);
      if (dayData) {
        return NextResponse.json(dayData);
      }
      return NextResponse.json({ error: 'Date not found' }, { status: 404 });
    }

    // 2. Week Query
    if (weekOf) {
      const resultDays = getWeekLiturgy(weekOf);
      return NextResponse.json(resultDays);
    }

    // 3. Month & Year Query
    if (month && year) {
      const yearData = getYearData(year);
      if (!yearData) {
        return NextResponse.json({ error: `Data not found for year ${year}` }, { status: 404 });
      }
      
      const monthNum = parseInt(month, 10);
      const monthData = yearData.filter((d) => d.thang === monthNum);
      
      return NextResponse.json(monthData);
    }

    return NextResponse.json({ 
      error: 'Missing parameters', 
      usage: '?date=YYYY-MM-DD or ?week_of=YYYY-MM-DD or ?month=MM&year=YYYY' 
    }, { status: 400 });

  } catch (error) {
    console.error("Lich Phung Vu API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
