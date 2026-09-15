// Trigger HMR
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVatican2Data, getVatican2DocumentById } from '@/lib/vatican2-server';
import Vatican2Viewer from '@/components/Vatican2Viewer';
import Vatican2Sidebar from '@/components/Vatican2Sidebar';
import Vatican2Search from '@/components/Vatican2Search';

export function generateStaticParams() {
  const data = getVatican2Data();
  return data.documents.map((doc) => ({
    slug: doc.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const doc = getVatican2DocumentById(resolvedParams.slug);
  
  if (!doc) {
    return {
      title: 'Không tìm thấy Văn kiện | Vericath',
    };
  }

  return {
    title: `${doc.title_vi} (${doc.abbrev}) | Vatican 2 | Vericath`,
    description: `Đọc văn kiện ${doc.title_vi} của Thánh Công Đồng chung Vatican 2. Bản dịch tiếng Việt chuẩn.`,
  };
}

export default async function Vatican2DocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const doc = getVatican2DocumentById(resolvedParams.slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b132b] flex flex-col md:flex-row relative">
      
      {/* Sidebar Navigation */}
      <Vatican2Sidebar document={doc} />
      
      {/* Search Button & Modal */}
      <Vatican2Search document={doc} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Vatican2Viewer document={doc} />
        </div>
      </main>
    </div>
  );
}
