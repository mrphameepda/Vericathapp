import { redirect } from 'next/navigation';
import { getTodayDateStr } from '@/lib/loi-chua';

export default function DailyReadingIndex() {
  const today = getTodayDateStr();
  redirect(`/bai-doc-hang-ngay/${today}`);
}
