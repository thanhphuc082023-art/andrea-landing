'use client';

export default function ImageTextSectionWithTitle({ data }: any) {
  const title = data?.title || 'Andrea — Thiết kế thương hiệu & bao bì';
  const description = data?.description || '';
  const imageSrc = data?.image || '';

  return (
    <section className="content-wrapper py-[60px] max-md:!px-0">
      <div className="mx-auto max-w-[890px]">
        <div className="max-md:px-[25px]">
          <h2 className="font-playfair text-brand-orange mb-4 text-center text-[40px] font-medium leading-[60px] max-md:text-[27px] max-md:leading-[40px]">
            <div // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: title || '' }}
            />
          </h2>

          <div className="text-[20px] leading-relaxed text-black">
            <div // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: description || '' }}
            />
          </div>
        </div>

        <div className="relative mt-10 flex justify-center max-md:mt-4">
          <div className="rounded-15 w-[881px] max-w-full flex-shrink-0 overflow-hidden [aspect-ratio:881/496]">
            <img
              src={imageSrc}
              alt={data?.alt || 'Andrea image'}
              className="block h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
