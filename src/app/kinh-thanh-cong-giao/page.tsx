import BibleReader from '@/components/BibleReader';
import { getBilingualChapter, getChaptersForBook } from '@/lib/bible-service';

export const metadata = {
  title: 'Kinh Thánh Công Giáo | Vericath',
  description: 'Đọc và đối chiếu Kinh Thánh Công Giáo đa ngôn ngữ.',
};

export default async function BiblePage() {
  const initialBook = 'st';
  const initialChapter = 1;
  
  const { verses: initialVerses, footnotesVi: initialFootnotesVi } = await getBilingualChapter(initialBook, initialChapter);
  const initialAvailableChapters = await getChaptersForBook(initialBook);

  return (
    <BibleReader 
      initialBook={initialBook}
      initialChapter={initialChapter}
      initialVerses={initialVerses}
      initialFootnotesVi={initialFootnotesVi || {}}
      initialAvailableChapters={initialAvailableChapters}
    />
  );
}
