import { Metadata } from 'next';
import { getLoiChuaByDate, LoiChuaDay } from '@/lib/loi-chua';
import { ChevronLeft, ChevronRight, BookOpen, Info } from 'lucide-react';
import Link from 'next/link';
import ReadingDatePicker from '@/components/ReadingDatePicker';

type Props = {
  params: Promise<{ date: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const { liturgy, readings, error } = getLoiChuaByDate(date);
  
  if (!liturgy) {
    return { title: 'Không tìm thấy dữ liệu - Vericath' };
  }

  const isDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const dateDisplay = isDate ? `Ngày ${date.split('-').reverse().join('/')}` : liturgy.ten_le;
  
  const title = `Lời Chúa ${dateDisplay} | Vericath`;
  let description = 'Bài đọc hằng ngày và Phúc Âm theo lịch phụng vụ Công giáo.';
  
  if (readings && readings.bai_doc?.phuc_am?.noi_dung) {
    // Truncate description for SEO
    description = readings.bai_doc.phuc_am.noi_dung.replace(/\n/g, ' ').substring(0, 160) + '...';
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    }
  };
}

function formatDateDisplay(dateStr: string) {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getPrevNextDate(dateStr: string) {
  const current = new Date(dateStr);
  
  const prev = new Date(current);
  prev.setDate(prev.getDate() - 1);
  const next = new Date(current);
  next.setDate(next.getDate() + 1);
  
  const format = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  
  return { prev: format(prev), next: format(next) };
}

export default async function DailyReadingPage({ params }: Props) {
  const { date } = await params;
  const { liturgy, readings, error } = getLoiChuaByDate(date);
  
  const isDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const { prev, next } = isDate ? getPrevNextDate(date) : { prev: null, next: null };

  const displayDate = isDate ? formatDateDisplay(date) : null;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8 gap-2">
         {isDate && prev ? (
           <Link href={`/bai-doc-hang-ngay/${prev}`} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
             <ChevronLeft size={16} /> Ngày trước
           </Link>
         ) : <div />}
         
         <ReadingDatePicker />

         {isDate && next ? (
           <Link href={`/bai-doc-hang-ngay/${next}`} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
             Ngày sau <ChevronRight size={16} />
           </Link>
         ) : <div />}
      </div>

        {/* Liturgy Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
           <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded">
                 {liturgy?.thu || 'Đang cập nhật'}
              </span>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                 Ngày {displayDate}
              </span>
           </div>
           
           <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white leading-tight mb-3">
              {liturgy?.ten_le || readings?.tieu_de || 'Bài Đọc Hằng Ngày'}
           </h1>
           
           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              {liturgy?.mua_phung_vu && (
                 <div className="flex items-center gap-1">
                    <span className="font-semibold">Mùa:</span> {liturgy.mua_phung_vu} {liturgy.tuan && `- Tuần ${liturgy.tuan}`}
                 </div>
              )}
              {liturgy?.mau_sac && (
                 <div className="flex items-center gap-1.5">
                    <span className="font-semibold">Màu:</span> 
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full shadow-inner ${
                         liturgy.mau_sac === 'Trắng' ? 'bg-white border border-gray-300' :
                         liturgy.mau_sac === 'Đỏ' ? 'bg-red-500' :
                         liturgy.mau_sac === 'Tím' ? 'bg-purple-600' :
                         liturgy.mau_sac === 'Hồng' ? 'bg-pink-400' :
                         'bg-green-500'
                      }`}></div>
                      {liturgy.mau_sac}
                    </div>
                 </div>
              )}
           </div>
        </div>

        {/* Content */}
        {error ? (
           <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-2xl p-6 text-center text-yellow-800 dark:text-yellow-400 flex flex-col items-center gap-3">
              <Info size={32} className="text-yellow-500 opacity-80" />
              <p className="font-medium">{error}</p>
              <p className="text-sm opacity-80 mt-2">Dữ liệu có thể mang tính địa phương hoặc đang trong quá trình cập nhật. Xin bạn vui lòng xem trực tiếp trên Lịch Phụng Vụ.</p>
           </div>
        ) : readings ? (
           <div className="space-y-12 pb-10">
              
              {/* Bài đọc 1 */}
              {readings.bai_doc?.bai_doc_1 && readings.bai_doc.bai_doc_1.noi_dung && (
                <section>
                   <div className="flex items-baseline gap-3 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
                      <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide">Bài Đọc I</h2>
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{readings.bai_doc.bai_doc_1.trich_dan}</span>
                   </div>
                   {readings.bai_doc.bai_doc_1.chu_de && (
                      <p className="text-gray-600 dark:text-gray-400 italic mb-4 font-serif">{readings.bai_doc.bai_doc_1.chu_de}</p>
                   )}
                   <div className="prose prose-lg dark:prose-invert max-w-none font-serif text-gray-800 dark:text-gray-200 leading-relaxed space-y-4">
                      {readings.bai_doc.bai_doc_1.noi_dung.split('\n').map((para, i) => (
                         <p key={i}>{para}</p>
                      ))}
                   </div>
                </section>
              )}

              {/* Đáp ca */}
              {readings.bai_doc?.dap_ca && readings.bai_doc.dap_ca.cau_dap && (
                <section>
                   <div className="flex items-baseline gap-3 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
                      <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide">Đáp Ca</h2>
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{readings.bai_doc.dap_ca.trich_dan}</span>
                   </div>
                   <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800/30 mb-6">
                      <p className="font-bold text-blue-900 dark:text-blue-300 font-serif">Đ. {readings.bai_doc.dap_ca.cau_dap}</p>
                   </div>
                   <div className="font-serif text-gray-800 dark:text-gray-200 leading-relaxed space-y-4">
                      {readings.bai_doc.dap_ca.cac_cau_xuong?.map((cau, i) => (
                         <p key={i} className="pl-6 relative">
                            <span className="absolute left-0 top-0 font-bold text-gray-400">X.</span>
                            {cau}
                         </p>
                      ))}
                   </div>
                </section>
              )}

              {/* Bài đọc 2 */}
              {readings.bai_doc?.bai_doc_2 && readings.bai_doc.bai_doc_2.noi_dung && (
                <section>
                   <div className="flex items-baseline gap-3 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
                      <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide">Bài Đọc II</h2>
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{readings.bai_doc.bai_doc_2.trich_dan}</span>
                   </div>
                   {readings.bai_doc.bai_doc_2.chu_de && (
                      <p className="text-gray-600 dark:text-gray-400 italic mb-4 font-serif">{readings.bai_doc.bai_doc_2.chu_de}</p>
                   )}
                   <div className="prose prose-lg dark:prose-invert max-w-none font-serif text-gray-800 dark:text-gray-200 leading-relaxed space-y-4">
                      {readings.bai_doc.bai_doc_2.noi_dung.split('\n').map((para, i) => (
                         <p key={i}>{para}</p>
                      ))}
                   </div>
                </section>
              )}

              {/* Alleluia */}
              {readings.bai_doc?.alleluia && readings.bai_doc.alleluia.noi_dung && (
                <section>
                   <div className="text-center font-serif text-gray-800 dark:text-gray-200 py-6 border-y border-dashed border-gray-300 dark:border-gray-700 my-8">
                      <span className="font-bold text-red-700 dark:text-red-400 uppercase block mb-2">Tung hô Tin Mừng</span>
                      <p className="italic font-medium">{readings.bai_doc.alleluia.noi_dung}</p>
                   </div>
                </section>
              )}

              {/* Phúc Âm */}
              {readings.bai_doc?.phuc_am && readings.bai_doc.phuc_am.noi_dung && (
                <section>
                   <div className="flex items-baseline gap-3 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
                      <h2 className="text-2xl font-bold text-red-700 dark:text-red-500 uppercase tracking-wide">Phúc Âm</h2>
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{readings.bai_doc.phuc_am.trich_dan}</span>
                   </div>
                   {readings.bai_doc.phuc_am.chu_de && (
                      <p className="text-gray-600 dark:text-gray-400 italic mb-6 font-serif text-lg text-center max-w-xl mx-auto">
                        "{readings.bai_doc.phuc_am.chu_de}"
                      </p>
                   )}
                   <div className="prose prose-xl dark:prose-invert max-w-none font-serif text-gray-900 dark:text-gray-100 leading-loose space-y-6">
                      {readings.bai_doc.phuc_am.noi_dung.split('\n').map((para, i) => {
                         // Gắn highlight cho câu đầu tiên "Đó là lời Chúa" nếu có
                         if (para.includes("Đó là lời Chúa.")) {
                            return <p key={i} className="font-bold text-red-800 dark:text-red-400 mt-8 text-center">{para}</p>;
                         }
                         return <p key={i} className="text-justify">{para}</p>;
                      })}
                   </div>
                </section>
              )}
           </div>
        ) : null}
    </div>
  );
}
