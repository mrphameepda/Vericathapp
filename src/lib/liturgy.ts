import fs from 'fs';
import path from 'path';

export interface LiturgyDay {
  ngay: string;
  thang: number;
  nam: number;
  thu: string;
  slug: string;
  ten_le: string | null;
  mua_phung_vu: string | null;
  tuan: string | null;
  mau_sac: string;
  bac_le: string | null;
  bai_doc_1: { ma_dinh_danh: string | null, trich_dan: string | null };
  bai_doc_2?: { ma_dinh_danh: string | null, trich_dan: string | null };
  dap_ca: { ma_dinh_danh: string | null, trich_dan: string | null };
  phuc_am: { ma_dinh_danh: string | null, trich_dan: string | null };
  nguon_url: string;
  xem_bai_doc_hom_nay: { ma_dinh_danh: string, duong_dan: string };
}

export function getYearData(targetYear: string | number): LiturgyDay[] | null {
  const dataDir = path.join(process.cwd(), 'public', 'data', 'lich-phung-vu');
  
  // Check if the individual year file exists
  const exactFilePath = path.join(dataDir, `lich-cong-giao-${targetYear}.json`);
  if (fs.existsSync(exactFilePath)) {
    return JSON.parse(fs.readFileSync(exactFilePath, 'utf8'));
  }
  
  // Check combo files like 2026-2027
  try {
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      const comboFile = files.find(f => f.includes(`${targetYear}`) && f.endsWith('.json'));
      if (comboFile) {
        return JSON.parse(fs.readFileSync(path.join(dataDir, comboFile), 'utf8'));
      }
    }
  } catch (e) {
    console.error("Error reading data dir", e);
  }
  
  return null;
}

export function getDayLiturgy(dateStr: string): LiturgyDay | null {
  const queryYear = dateStr.split('-')[0];
  const yearData = getYearData(queryYear);
  if (!yearData) return null;
  
  return yearData.find((d: LiturgyDay) => d.ngay === dateStr) || null;
}

export function getWeekLiturgy(dateStr: string): LiturgyDay[] {
  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) return [];

  // Find the Sunday of this week (0 = Sunday)
  const dayOfWeek = targetDate.getDay();
  const sunday = new Date(targetDate);
  sunday.setDate(sunday.getDate() - dayOfWeek);
  
  const resultDays: LiturgyDay[] = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(sunday);
    currentDate.setDate(sunday.getDate() + i);
    
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');
    const curDateStr = `${y}-${m}-${d}`;
    
    const yearData = getYearData(y);
    if (yearData) {
      const dayData = yearData.find((item: LiturgyDay) => item.ngay === curDateStr);
      if (dayData) resultDays.push(dayData);
    }
  }
  
  return resultDays;
}
