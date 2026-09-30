"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  slug: string;
  data: any;
  indexData: any;
}

export default function SachLeRomaContent({ slug, data, indexData }: Props) {
  const [todayLiturgy, setTodayLiturgy] = useState<any>(null);

  useEffect(() => {
    async function fetchToday() {
      try {
        const now = new Date();
        // UTC+7 for Vietnam
        const vnTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        const year = vnTime.getUTCFullYear();
        const month = String(vnTime.getUTCMonth() + 1).padStart(2, '0');
        const day = String(vnTime.getUTCDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const res = await fetch(`/data/lich-phung-vu/lich-cong-giao-${year}.json`);
        if (res.ok) {
          const calendar = await res.json();
          const todayData = calendar.find((d: any) => d.ngay === todayStr);
          if (todayData) {
            setTodayLiturgy(todayData);
          }
        }
      } catch (e) {
        console.error("Failed to fetch calendar", e);
      }
    }
    fetchToday();
  }, []);

  // --- Render logic based on slug ---

  if (slug === 'nghi-thuc-thanh-le') {
    return <RenderNghiThucDauLe data={data} />;
  }

  if (slug === 'bai-doc') {
    return <RenderBaiDoc indexData={indexData} todayLiturgy={todayLiturgy} />;
  }

  // Generic Dropdown Handler for others
  return <RenderDropdownContent slug={slug} data={data} todayLiturgy={todayLiturgy} />;
}

// ==========================================
// 1. NGHI THỨC ĐẦU LỄ (No Dropdown except Thống Hối)
// ==========================================
function RenderNghiThucDauLe({ data }: { data: any[] }) {
  const [mauThongHoi, setMauThongHoi] = useState<number>(1);

  if (!data || !Array.isArray(data)) return <p>Dữ liệu trống</p>;

  return (
    <div className="space-y-12 bg-white p-0 md:p-4 max-w-3xl mx-auto">
      {data.map((section, sIdx) => {
        let items = section.danh_sach_hanh_dong || [];
        
        // Handle dropdown for HÀNH ĐỘNG THỐNG HỐI
        if (section.phan_muc === 'HÀNH ĐỘNG THỐNG HỐI') {
          // Parse the 3 models
          const m1 = items.slice(0, 4);
          const m2 = items.slice(4, 11);
          const m3 = items.slice(11, 20);
          const rest = items.slice(20);

          let selectedItems = m1;
          if (mauThongHoi === 2) selectedItems = m2;
          if (mauThongHoi === 3) selectedItems = m3;

          items = [...selectedItems, ...rest];
        }

        return (
          <div key={sIdx} className="p-0">
            <h2 className="text-xl font-bold text-red-800 mb-6 font-serif border-b border-red-100 pb-3">
              {section.phan_muc}
            </h2>
            
            {section.phan_muc === 'HÀNH ĐỘNG THỐNG HỐI' && (
              <div className="mb-6">
                <select
                  className="w-full md:w-1/2 bg-slate-50 text-base h-10 border border-red-200 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  value={mauThongHoi}
                  onChange={(e) => setMauThongHoi(Number(e.target.value))}
                >
                  <option value={1}>Mẫu 1</option>
                  <option value={2}>Mẫu 2</option>
                  <option value={3}>Mẫu 3</option>
                </select>
              </div>
            )}

            <div className="space-y-4">
              {items.map((act: any, aIdx: number) => (
                <ActionItem key={aIdx} action={act} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// 2. BÀI ĐỌC (Fetch Individual JSON)
// ==========================================
function RenderBaiDoc({ indexData, todayLiturgy }: { indexData: any[], todayLiturgy: any }) {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todayLiturgy?.xem_bai_doc_hom_nay?.ma_dinh_danh && indexData) {
      const match = indexData.find(item => item.file_name.includes(todayLiturgy.xem_bai_doc_hom_nay.ma_dinh_danh));
      if (match) setSelectedFile(match.file_name);
    }
  }, [todayLiturgy, indexData]);

  useEffect(() => {
    if (selectedFile) {
      setLoading(true);
      fetch(`/sach-le-roma/bai doc hang ngay/${selectedFile}`)
        .then(res => res.json())
        .then(data => {
          setContent(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [selectedFile]);

  // Group indexData by something? Usually too many items (616).
  // A Select is okay, but ideally a Combobox for search. For now, Select works.
  return (
    <div className="space-y-6">
      <select 
        className="w-full bg-white text-lg h-14 border border-red-200 rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-red-600"
        onChange={(e) => setSelectedFile(e.target.value)} 
        value={selectedFile}
      >
        <option value="">-- Chọn Bài Đọc --</option>
        {indexData?.map(item => (
          <option key={item.file_name} value={item.file_name}>
            {item.tieu_de} {item.thong_tin_ngay?.mau_sac ? `(${item.thong_tin_ngay.mau_sac})` : ''}
          </option>
        ))}
      </select>

      {loading && <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-700" /></div>}
      
      {!loading && content && (
        <div className="bg-white p-0 md:p-4 animate-in fade-in max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-red-800 text-center mb-8 font-serif uppercase border-b border-red-100 pb-4">
            {content.tieu_de}
          </h2>
          
          <div className="space-y-6">
            {content.ca_nhap_le && (
              <div>
                <h3 className="font-bold text-red-700 mb-2">Ca Nhập Lễ:</h3>
                <p className="italic text-slate-700">{content.ca_nhap_le}</p>
              </div>
            )}
            
            {content.loi_nguyen_nhap_le && (
              <div>
                <h3 className="font-bold text-red-700 mb-2">Lời Nguyện Nhập Lễ:</h3>
                <p className="text-slate-800 whitespace-pre-wrap">{content.loi_nguyen_nhap_le}</p>
              </div>
            )}

            {/* Bài Đọc 1 */}
            {content.bai_doc?.bai_doc_1 && (
              <div>
                <h3 className="font-bold text-red-700 mb-1">Bài Đọc 1: <span className="text-slate-600 font-normal">{content.bai_doc.bai_doc_1.trich_dan}</span></h3>
                <p className="font-semibold text-slate-800 mb-2">{content.bai_doc.bai_doc_1.chu_de}</p>
                <p className="text-slate-800 whitespace-pre-wrap text-justify">{content.bai_doc.bai_doc_1.noi_dung}</p>
              </div>
            )}

            {/* Đáp Ca */}
            {content.bai_doc?.dap_ca && (
              <div>
                <h3 className="font-bold text-red-700 mb-2">Đáp Ca: <span className="text-slate-600 font-normal">{content.bai_doc.dap_ca.trich_dan}</span></h3>
                <p className="font-bold text-red-600 mb-2">Đ. {content.bai_doc.dap_ca.dap}</p>
                <div className="space-y-2">
                  {content.bai_doc.dap_ca.cac_phien_khuc?.map((pk: string, i: number) => (
                    <div key={i}>
                      <p className="text-slate-700 whitespace-pre-wrap">{pk}</p>
                      <p className="font-bold text-red-600 mt-1">Đ. {content.bai_doc.dap_ca.dap}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bài Đọc 2 */}
            {content.bai_doc?.bai_doc_2 && (
              <div>
                <h3 className="font-bold text-red-700 mb-1">Bài Đọc 2: <span className="text-slate-600 font-normal">{content.bai_doc.bai_doc_2.trich_dan}</span></h3>
                <p className="font-semibold text-slate-800 mb-2">{content.bai_doc.bai_doc_2.chu_de}</p>
                <p className="text-slate-800 whitespace-pre-wrap text-justify">{content.bai_doc.bai_doc_2.noi_dung}</p>
              </div>
            )}

            {/* Tung Hô */}
            {content.bai_doc?.tung_ho_tin_mung && (
              <div>
                <h3 className="font-bold text-red-700 mb-2">Tung Hô Tin Mừng:</h3>
                <p className="italic text-slate-700">{content.bai_doc.tung_ho_tin_mung}</p>
              </div>
            )}

            {/* Phúc Âm */}
            {content.bai_doc?.phuc_am && (
              <div>
                <h3 className="font-bold text-red-700 mb-1">Phúc Âm: <span className="text-slate-600 font-normal">{content.bai_doc.phuc_am.trich_dan}</span></h3>
                <p className="font-semibold text-slate-800 mb-2">{content.bai_doc.phuc_am.chu_de}</p>
                <p className="text-slate-800 whitespace-pre-wrap text-justify leading-relaxed">{content.bai_doc.phuc_am.noi_dung}</p>
              </div>
            )}

            {content.loi_nguyen_tien_le && (
              <div>
                <h3 className="font-bold text-red-700 mb-2">Lời Nguyện Tiến Lễ:</h3>
                <p className="text-slate-800 whitespace-pre-wrap">{content.loi_nguyen_tien_le}</p>
              </div>
            )}

            {content.ca_hiep_le && (
              <div>
                <h3 className="font-bold text-red-700 mb-2">Ca Hiệp Lễ:</h3>
                <p className="italic text-slate-700">{content.ca_hiep_le}</p>
              </div>
            )}

            {content.loi_nguyen_hiep_le && (
              <div>
                <h3 className="font-bold text-red-700 mb-2">Lời Nguyện Hiệp Lễ:</h3>
                <p className="text-slate-800 whitespace-pre-wrap">{content.loi_nguyen_hiep_le}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. GENERIC DROPDOWN HANDLER (For others)
// ==========================================
function RenderDropdownContent({ slug, data, todayLiturgy }: { slug: string, data: any, todayLiturgy?: any }) {
  const [selectedId, setSelectedId] = useState<string>('');

  // Extract options based on data shape
  const options: { group: string, items: { id: string, name: string, fullData: any }[] }[] = [];

  if (!data) return null;

  if (slug === 'loi-nguyen' && Array.isArray(data)) {
    // data is [[{ phan_muc, cac_mau_tuy_chon: [...] }]]
    data.forEach((d: any[]) => {
      d.forEach(section => {
        options.push({
          group: section.phan_muc,
          items: section.cac_mau_tuy_chon?.map((opt: any, idx: number) => ({
            id: `${opt.ma_dinh_danh}-${idx}`,
            name: opt.ten_mau,
            fullData: opt
          })) || []
        });
      });
    });
  } else if (slug === 'dan-le-va-loi-nguyen-giao-dan' && Array.isArray(data)) {
    // data is [{ phan_muc, cac_mau_tuy_chon }]
    // But the JSON has a bug where all 180 items are deeply nested inside each other. We need to extract them recursively.
    const allItems: any[] = [];
    const extractItems = (node: any) => {
      if (Array.isArray(node)) {
        node.forEach(extractItems);
      } else if (typeof node === 'object' && node !== null) {
        if (node.ma_dinh_danh && node.ten_mau) {
          allItems.push(node);
        }
        Object.values(node).forEach(extractItems);
      }
    };
    extractItems(data);

    const groups: Record<string, any[]> = {
      'Mùa Vọng & Giáng Sinh': [],
      'Mùa Chay & Tuần Thánh': [],
      'Mùa Phục Sinh': [],
      'Mùa Thường Niên': [],
      'Các Ngày Lễ Đặc Biệt': [],
    };

    allItems.forEach((opt: any, idx: number) => {
      const name = (opt.ten_mau || '').toUpperCase();
      const mapped = {
        id: `${opt.ma_dinh_danh}-${idx}`,
        name: opt.ten_mau,
        fullData: opt
      };
      
      if (name.includes('MÙA VỌNG') || name.includes('GIÁNG SINH') || name.includes('THÁNH GIA') || name.includes('HIỂN LINH')) {
        groups['Mùa Vọng & Giáng Sinh'].push(mapped);
      } else if (name.includes('MÙA CHAY') || name.includes('LỄ TRO') || name.includes('TUẦN THÁNH') || name.includes('LỄ LÁ')) {
        groups['Mùa Chay & Tuần Thánh'].push(mapped);
      } else if (name.includes('PHỤC SINH') || name.includes('THĂNG THIÊN') || name.includes('HIỆN XUỐNG') || name.includes('MÌNH MÁU THÁNH') || name.includes('THÁNH TÂM') || name.includes('CHÚA BA NGÔI')) {
        groups['Mùa Phục Sinh'].push(mapped);
      } else if (name.includes('THƯỜNG NIÊN')) {
        groups['Mùa Thường Niên'].push(mapped);
      } else {
        groups['Các Ngày Lễ Đặc Biệt'].push(mapped);
      }
    });

    Object.entries(groups).forEach(([groupName, items]) => {
      if (items.length > 0) {
        options.push({ group: groupName, items });
      }
    });
  } else if ((slug === 'kinh-tien-tung' || slug === 'kinh-nguyen-thanh-the') && data.phan_muc) {
    // data is { phan_muc, cac_mau_tuy_chon }
    options.push({
      group: data.phan_muc,
      items: data.cac_mau_tuy_chon?.map((opt: any, idx: number) => ({
        id: `${opt.ma_dinh_danh}-${idx}`,
        name: opt.ten_mau,
        fullData: opt
      })) || []
    });
  } else if (slug === 'phep-lanh-cuoi-le' && Array.isArray(data)) {
    // data is [{ma_dinh_danh, ten_mau}]
    options.push({
      group: 'Phép lành cuối lễ',
      items: data.map((opt: any, idx: number) => ({
        id: `${opt.ma_dinh_danh}-${idx}`,
        name: opt.ten_mau,
        fullData: opt
      }))
    });
  } else if (slug === 'thanh-le-co-nghi-thuc-rieng' && Array.isArray(data)) {
    // data is [{ phan_muc_chinh, cac_mau_tuy_chon }]
    data.forEach(section => {
      options.push({
        group: section.phan_muc_chinh,
        items: section.cac_mau_tuy_chon?.map((opt: any, idx: number) => ({
          id: `${opt.ma_dinh_danh}-${idx}`,
          name: opt.ten_mau,
          fullData: opt
        })) || []
      });
    });
  } else if (slug === 'nghi-thuc-an-tang' && Array.isArray(data)) {
    // data is [{ phan_muc_chinh, dien_tien_thanh_le }]
    // No cac_mau_tuy_chon. The options ARE the phan_muc_chinh!
    options.push({
      group: 'Nghi thức An táng',
      items: data.map((section: any, idx: number) => ({
        id: `an-tang-${idx}`,
        name: section.phan_muc_chinh,
        fullData: section
      }))
    });
  }

  // Set default selection based on slug constraints
  useEffect(() => {
    if (!options.length) return;

    if (slug === 'kinh-tien-tung') {
      const defaultOpt = options.flatMap(g => g.items).find(i => i.name.toUpperCase().includes('KINH TIỀN TỤNG MÙA VỌNG I') || i.name.toUpperCase().includes('KINH TIỀN TỤNG'));
      if (defaultOpt) setSelectedId(defaultOpt.id);
      else setSelectedId(options[0].items[0].id);
    } else if (slug === 'kinh-nguyen-thanh-the') {
      const defaultOpt = options.flatMap(g => g.items).find(i => i.name.toUpperCase().includes('THÁNH THỂ II'));
      if (defaultOpt) setSelectedId(defaultOpt.id);
      else setSelectedId(options[0].items[0].id);
    } else if (slug === 'thanh-le-co-nghi-thuc-rieng') {
      const defaultOpt = options.flatMap(g => g.items).find(i => i.name.toUpperCase().includes('CỬ HÀNH BÍ TÍCH HÔN PHỐI (MẪU 1)'));
      if (defaultOpt) setSelectedId(defaultOpt.id);
      else setSelectedId(options[0].items[0].id);
    } else if (slug === 'nghi-thuc-an-tang') {
      const defaultOpt = options.flatMap(g => g.items).find(i => i.name.toUpperCase().includes('LỄ AN TÁNG TRẺ EM ĐÃ RỬA TỘI'));
      if (defaultOpt) setSelectedId(defaultOpt.id);
      else setSelectedId(options[0].items[0].id);
    } else if (slug === 'loi-nguyen' || slug === 'dan-le-va-loi-nguyen-giao-dan' || slug === 'phep-lanh-cuoi-le') {
      let matchedId = '';
      if (todayLiturgy && (slug === 'loi-nguyen' || slug === 'dan-le-va-loi-nguyen-giao-dan')) {
        const normSafe = (s: string) => {
          if (!s) return '';
          let str = s.toLowerCase();
          str = str.replace(/\bviii\b/g, '8').replace(/\bvii\b/g, '7').replace(/\bvi\b/g, '6')
                   .replace(/\biv\b/g, '4').replace(/\bv\b/g, '5').replace(/\biii\b/g, '3')
                   .replace(/\bii\b/g, '2').replace(/\bi\b/g, '1').replace(/\bx\b/g, '10').replace(/\bix\b/g, '9');
          return str.replace(/[\s-]/g, '');
        };
        
        let searchStr = normSafe(todayLiturgy.ten_le || '');
        if ((!searchStr || searchStr.includes('ngàythường')) && todayLiturgy.tuan && todayLiturgy.mua_phung_vu) {
           searchStr = normSafe(`Chúa Nhật ${todayLiturgy.tuan} ${todayLiturgy.mua_phung_vu}`);
        }
        
        const allItems = options.flatMap(g => g.items);
        if (searchStr) {
          const match = allItems.find(i => {
            const iName = normSafe(i.name);
            return iName.includes(searchStr) || searchStr.includes(iName);
          });
          if (match) matchedId = match.id;
        }
      }
      
      if (matchedId) {
        setSelectedId(matchedId);
      } else if (!selectedId) {
        setSelectedId(options[0].items[0].id);
      }
    }
  }, [slug, data, options.length, todayLiturgy]); // run when data/slug changes

  // Flatten to find the selected data
  const selectedItem = options.flatMap(g => g.items).find(i => i.id === selectedId);

  return (
    <div className="space-y-6">
      <select 
        className="w-full bg-white text-lg h-14 border border-red-200 rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-red-600"
        onChange={(e) => setSelectedId(e.target.value)} 
        value={selectedId || ''}
      >
        <option value="" disabled>-- Chọn Nội Dung --</option>
        {options.map((group, gIdx) => (
          <optgroup key={gIdx} label={group.group}>
            {group.items.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {selectedItem && (
        <div className="bg-white p-0 md:p-4 animate-in fade-in max-w-3xl mx-auto">
          {/* Display Full Data recursively or dynamically */}
          <GenericDataRenderer data={selectedItem.fullData} slug={slug} />
        </div>
      )}
    </div>
  );
}

// ==========================================
// Generic Renderer for Object content
// ==========================================
function GenericDataRenderer({ data, slug }: { data: any, slug: string }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Title */}
      {data.ten_mau && <h2 className="text-2xl font-bold text-red-800 text-center font-serif uppercase border-b border-red-100 pb-4">{data.ten_mau}</h2>}
      {data.phan_muc_chinh && !data.ten_mau && <h2 className="text-2xl font-bold text-red-800 text-center font-serif uppercase border-b border-red-100 pb-4">{data.phan_muc_chinh}</h2>}
      
      {/* Meta */}
      {data.y_nghia && <p className="text-slate-600 text-center font-medium">{data.y_nghia}</p>}
      {data.chi_dan_do_mau && <p className="italic text-red-700 text-center text-sm">{data.chi_dan_do_mau}</p>}

      {/* Render Actions if array */}
      {data.danh_sach_hanh_dong && (
        <div className="space-y-4 mt-6">
          {data.danh_sach_hanh_dong.map((act: any, idx: number) => (
            <ActionItem key={idx} action={act} />
          ))}
        </div>
      )}

      {/* Render An Tang specific format (dien_tien_thanh_le) */}
      {data.dien_tien_thanh_le && (
        <div className="space-y-8 mt-6">
          {data.dien_tien_thanh_le.map((dien: any, idx: number) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-bold text-red-800 text-lg border-b border-red-50 pb-2">{dien.phan}</h3>
              {dien.chi_tiet?.map((ct: any, cIdx: number) => (
                <ActionItem key={cIdx} action={ct} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Basic Key-Value pairs (ca_nhap_le, loi_nguyen...) */}
      <div className="space-y-4 mt-4">
        {Object.entries(data).map(([key, val]) => {
          if (['ma_dinh_danh', 'ten_mau', 'y_nghia', 'chi_dan_do_mau', 'danh_sach_hanh_dong', 'phan_muc_chinh', 'dien_tien_thanh_le', 'cac_mau_tuy_chon'].includes(key)) return null;
          
          const label = key.replace(/_/g, ' ').toUpperCase();
          
          // If val is a string
          if (typeof val === 'string') {
            return (
              <div key={key}>
                <h4 className="font-bold text-red-700 text-sm mb-1">{label}:</h4>
                <p className="text-slate-800 whitespace-pre-wrap">{val}</p>
              </div>
            );
          }

          // If val is an array of objects
          if (Array.isArray(val)) {
            return (
              <div key={key} className="space-y-2">
                <h4 className="font-bold text-red-700 text-sm mb-1">{label}:</h4>
                {val.map((item: any, i) => (
                  <ActionItem key={i} action={item} />
                ))}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

// Component to render individual { chi_dan_do, vai_tro, loi_doc }
function ActionItem({ action }: { action: any }) {
  if (typeof action !== 'object' || !action) return null;

  let role = action.vai_tro;
  let instruction = action.chi_dan_do;
  const text = action.loi_doc;

  // Cleanup instruction
  if (instruction) {
    instruction = instruction.replace(/MẪU \d\n/g, '');
    const cleanInst = instruction.trim().toUpperCase();
    if (cleanInst === 'X.' || cleanInst === 'X:' || cleanInst === 'Đ.' || cleanInst === 'Đ:') {
      role = cleanInst.replace('.', ':');
      instruction = null;
    }
  }

  // Also clean role if it contains X: or Đ:
  if (role) {
    role = role.trim();
    if (role.endsWith(':')) {
      // Don't append another colon later
    } else {
      role = `${role}:`;
    }
  }

  return (
    <div className="mb-3">
      {instruction && (
        <p className="italic text-red-700 text-sm mb-1 whitespace-pre-wrap">
          {instruction}
        </p>
      )}
      {(role || text) && (
        <div className="flex gap-2">
          {role && (
            <span className="font-bold text-slate-800 shrink-0">{role}</span>
          )}
          {text && (
            <span className="text-slate-800 whitespace-pre-wrap flex-1">{text}</span>
          )}
        </div>
      )}
    </div>
  );
}
