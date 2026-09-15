import Link from 'next/link';
import { getAllVatican2Documents } from '@/lib/vatican2-server';
import { BookOpen, Calendar, ScrollText } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Văn kiện Vatican 2 | Vericath',
  description: 'Toàn bộ 16 văn kiện của Thánh Công Đồng chung Vatican 2 (Hiến chế, Sắc lệnh, Tuyên ngôn) với bản dịch tiếng Việt.',
};

export default function Vatican2ListPage() {
  const documents = getAllVatican2Documents();

  // Group by kind
  const groupedDocs = documents.reduce((acc, doc) => {
    let group = doc.kind;
    // Normalize kinds if needed (e.g. group all Hiến chế together)
    if (group.toLowerCase().includes('hiến chế')) {
      group = 'Hiến chế (Constitutions)';
    } else if (group.toLowerCase().includes('sắc lệnh')) {
      group = 'Sắc lệnh (Decrees)';
    } else if (group.toLowerCase().includes('tuyên ngôn')) {
      group = 'Tuyên ngôn (Declarations)';
    }
    
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  // Order groups: Constitutions, Decrees, Declarations
  const groupOrder = ['Hiến chế (Constitutions)', 'Sắc lệnh (Decrees)', 'Tuyên ngôn (Declarations)'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b132b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-400 sm:text-4xl">
            Thánh Công Đồng Vatican 2
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Tập hợp 16 văn kiện của Công đồng chung Vatican II (1962-1965)
          </p>
        </div>

        <div className="space-y-12">
          {groupOrder.map((group) => {
            const docs = groupedDocs[group];
            if (!docs || docs.length === 0) return null;

            return (
              <section key={group}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2 mb-6 inline-block">
                  {group}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {docs.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/van-kien-vatican-2/${doc.id}`}
                      className="flex flex-col bg-white dark:bg-[#1a233a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-lg text-blue-600 dark:text-blue-400">
                          {group.includes('Hiến chế') ? (
                            <BookOpen size={24} />
                          ) : (
                            <ScrollText size={24} />
                          )}
                        </div>
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded">
                          {doc.abbrev}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {doc.title_vi}
                      </h3>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 italic">
                        {doc.title_la} ({doc.title_meaning})
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{doc.promulgated_vi}</span>
                        </div>
                        <span>{doc.article_count} số</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
