import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quy Tắc Trích Dẫn | Vericath',
};

export default function CitationRulesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b132b] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">Quy Tắc Trích Dẫn</h1>
        <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
          <p>Nội dung đang được cập nhật...</p>
        </div>
      </div>
    </div>
  );
}
