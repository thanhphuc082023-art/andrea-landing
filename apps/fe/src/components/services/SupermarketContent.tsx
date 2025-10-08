'use client';

import BrandSection from '@/components/services/BrandSection';

export default function SupermarketContent({ data }: any) {
  return (
    <section className="content-wrapper my-[56px] max-md:my-[29px]">
      <BrandSection title={data.title} description={data.description} />
    </section>
  );
}
