import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import SachLeRomaContent from '@/components/SachLeRomaContent';
import { SACH_LE_ROMA_TABS } from '@/lib/sach-le-roma-tabs';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return SACH_LE_ROMA_TABS.map((tab) => ({
    slug: tab.id,
  }));
}

export default async function SachLeRomaTabPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const tabInfo = SACH_LE_ROMA_TABS.find(t => t.id === slug);
  if (!tabInfo) {
    notFound();
  }

  const publicDir = path.join(process.cwd(), 'public', 'sach-le-roma');
  let data = null;
  let indexData = null;

  try {
    switch (slug) {
      case 'nghi-thuc-thanh-le':
        data = JSON.parse(fs.readFileSync(path.join(publicDir, 'nghi thuc dau le.json'), 'utf8'));
        break;
      case 'loi-nguyen':
        data = JSON.parse(fs.readFileSync(path.join(publicDir, 'cac loi nguyen trong thanh le.json'), 'utf8'));
        break;
      case 'bai-doc':
        // For bai-doc, we just pass the index. The client component will fetch individual JSON files.
        indexData = JSON.parse(fs.readFileSync(path.join(publicDir, 'bai-doc-index.json'), 'utf8'));
        break;
      case 'dan-le-va-loi-nguyen-giao-dan':
        data = JSON.parse(fs.readFileSync(path.join(publicDir, 'dan-le-va-loi-nguyen-giao-dan.json'), 'utf8'));
        break;
      case 'kinh-tien-tung':
        data = JSON.parse(fs.readFileSync(path.join(publicDir, 'kinh tien tung.json'), 'utf8'));
        break;
      case 'kinh-nguyen-thanh-the':
        data = JSON.parse(fs.readFileSync(path.join(publicDir, 'kinh nguyen thanh the.json'), 'utf8'));
        break;
      case 'phep-lanh-cuoi-le':
        data = JSON.parse(fs.readFileSync(path.join(publicDir, 'phep lanh cuoi le.json'), 'utf8'));
        break;
      case 'thanh-le-co-nghi-thuc-rieng':
        data = JSON.parse(fs.readFileSync(path.join(publicDir, 'thanh le co nghi thuc rieng.json'), 'utf8'));
        break;
      case 'nghi-thuc-an-tang':
        data = JSON.parse(fs.readFileSync(path.join(publicDir, 'nghi thuc thanh le an tang.json'), 'utf8'));
        break;
    }
  } catch (error) {
    console.error(`Error loading data for ${slug}:`, error);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-red-900 mb-6 font-serif">{tabInfo.name}</h1>
      <SachLeRomaContent slug={slug} data={data} indexData={indexData} />
    </div>
  );
}
