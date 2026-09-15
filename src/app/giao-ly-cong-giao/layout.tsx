import React from 'react';
import CCCLayoutClient from '@/components/CCCLayoutClient';

export const metadata = {
  title: 'Giáo Lý Hội Thánh Công Giáo (CCC) | Bách Khoa Công Giáo',
  description: 'Tra cứu và tìm kiếm Giáo Lý Hội Thánh Công Giáo',
};

export default function CCCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CCCLayoutClient>
      {children}
    </CCCLayoutClient>
  );
}
