'use client';

import BrandSection from '@/components/services/BrandSection';
import Divider from '@/components/services/Divider';
import ImageTextSection from '@/components/services/ImageTextSection';

export default function SupermarketContent({ data }: any) {
  const subheadingHtml = data?.subheading || '';
  const image = data?.image || '';
  const heading = data?.heading || '';
  return (
    <>
      {/* Supermarket Section */}
      <section className="content-wrapper my-[56px] max-md:my-[29px]">
        <BrandSection title={data.title} description={data.description} />

        {image && heading && subheadingHtml && (
          <>
            <div className="max-md:hidden">
              <Divider />
            </div>
            <ImageTextSection
              image={image}
              heading={heading}
              subheadingHtml={subheadingHtml}
            />
          </>
        )}

        <Divider />
        {/* Section one */}
      </section>
    </>
  );
}
