'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ScrollToMuc() {
  const searchParams = useSearchParams();
  const muc = searchParams.get('muc');

  useEffect(() => {
    if (muc) {
      // Small timeout to ensure DOM is fully rendered
      setTimeout(() => {
        const element = document.getElementById(muc);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [muc]);

  return null;
}
