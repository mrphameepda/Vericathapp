import { redirect } from 'next/navigation';
import { getTodayDateStr } from '@/lib/loi-chua';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DailyReadingIndex() {
  const today = getTodayDateStr();
  redirect(`/bai-doc-hang-ngay/${today}`);
}
