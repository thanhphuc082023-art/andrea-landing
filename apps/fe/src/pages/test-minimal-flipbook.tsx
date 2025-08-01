'use client';

import React from 'react';
import MinimalFlipBook from '../components/MinimalFlipBook';

export default function TestMinimalFlipbook() {
  return (
    <div className="max-sd:mt-[60px] mt-[65px] bg-gray-900 p-8">
      <div className="mx-auto max-w-full">
          <MinimalFlipBook pdfUrl="/sample.pdf" />
      </div>
    </div>
  );
}
