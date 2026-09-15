import React from 'react';
import { getAllBooks } from '@/lib/giao-luat-server';
import CanonLawLayoutClient from '@/components/CanonLawLayoutClient';

export const metadata = {
  title: 'Giáo Luật Công Giáo 1983 - Code of Canon Law',
  description: 'Tra cứu Bộ Giáo Luật Công Giáo 1983 song ngữ Việt - Anh. Đầy đủ 7 quyển, tra cứu dễ dàng.',
};

export default function CanonLawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const books = getAllBooks();

  return (
    <CanonLawLayoutClient books={books}>
      {children}
    </CanonLawLayoutClient>
  );
}
